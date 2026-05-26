const SELECTABLE_TEXT_ERROR =
  "PDF does not contain selectable text. Please upload a text-based PDF.";

const normalizeText = (text) => {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const normalizeLine = (line) => String(line || "").replace(/[ \t]+/g, " ").trim();

const stripBullet = (line) => normalizeLine(line).replace(/^[•*-]\s*/, "").trim();

const isBulletLine = (line) => /^[•*-]\s+/.test(normalizeLine(line));

const normalizeHeadingKey = (line) => {
  return normalizeLine(line)
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/:$/, "")
    .toLocaleUpperCase("sr-RS");
};

const isHeadingLine = (line) => {
  const key = normalizeHeadingKey(line);
  return [
    "O ZEPTERU - VIŠE OD KOMPANIJE",
    "ZAŠTO OVA POZICIJA?",
    "ODGOVORNOSTI",
    "ZAHTEVI",
    "ŠTA ZEPTER NUDI",
    "KAKO SE PRIJAVITI?",
  ].includes(key);
};

const getSectionName = (line) => {
  const key = normalizeHeadingKey(line);

  if (key === "O ZEPTERU - VIŠE OD KOMPANIJE") return "about";
  if (key === "ZAŠTO OVA POZICIJA?") return "why";
  if (key === "ODGOVORNOSTI") return "responsibilities";
  if (key === "ZAHTEVI") return "requirements";
  if (key === "ŠTA ZEPTER NUDI") return "offers";
  if (key === "KAKO SE PRIJAVITI?") return "apply";

  return null;
};

const isRequirementSubheading = (line) => {
  const clean = normalizeLine(line);
  const key = normalizeHeadingKey(line);
  const hasExplicitMarker = clean.endsWith(":");

  if (key === "PREDNOST") {
    return hasExplicitMarker;
  }

  return [
    "OBRAZOVANJE I ISKUSTVO",
    "TEHNIČKA ZNANJA I KOMPETENCIJE",
    "PROFESIONALNE KOMPETENCIJE",
    "ISKUSTVO I ZNANJE",
    "TEHNIČKA ZNANJA",
  ].includes(key);
};

const toRequirementHeading = (line) => {
  return `${normalizeLine(line).replace(/:$/, "")}:`;
};

const appendWrappedLine = (items, line) => {
  if (items.length === 0) {
    return;
  }

  items[items.length - 1] = `${items[items.length - 1]} ${normalizeLine(line)}`.trim();
};

const parseListSection = (
  lines,
  { preserveRequirementHeadings = false, stopAtClosing = false } = {}
) => {
  const items = [];
  let reachedClosing = false;

  lines.forEach((line) => {
    const clean = normalizeLine(line);

    if (!clean || reachedClosing) {
      return;
    }

    if (stopAtClosing && /^Zepter International$/i.test(clean)) {
      reachedClosing = true;
      return;
    }

    if (preserveRequirementHeadings && isRequirementSubheading(clean)) {
      items.push(toRequirementHeading(clean));
      return;
    }

    if (isBulletLine(clean)) {
      items.push(stripBullet(clean));
      return;
    }

    if (/^Prijava treba da sadrži:?$/i.test(clean)) {
      return;
    }

    appendWrappedLine(items, clean);
  });

  return items.filter(Boolean);
};

const linesToText = (lines) => {
  return lines.map(normalizeLine).filter(Boolean).join(" ").trim();
};

const splitAboutAndIntro = (lines) => {
  const splitIndex = lines.findIndex((line) =>
    /^U cilju\b/i.test(normalizeLine(line))
  );

  if (splitIndex === -1) {
    return {
      aboutZepter: linesToText(lines),
      intro: [],
    };
  }

  return {
    aboutZepter: linesToText(lines.slice(0, splitIndex)),
    intro: [linesToText(lines.slice(splitIndex))].filter(Boolean),
  };
};

const extractPrefixedValue = (lines, prefix) => {
  const prefixPattern = new RegExp(`^${prefix}\\s*:\\s*(.*)$`, "i");
  const index = lines.findIndex((line) => prefixPattern.test(normalizeLine(line)));

  if (index === -1) {
    return "";
  }

  const match = normalizeLine(lines[index]).match(prefixPattern);
  return match?.[1]?.trim() || "";
};

const extractClosingAndFooter = (applyLines) => {
  const lines = applyLines.map(normalizeLine).filter(Boolean);
  const zepterIndex = lines.findIndex((line) =>
    /^Zepter International$/i.test(line)
  );

  if (zepterIndex === -1) {
    return {
      closingText: "",
      footerNote: "",
    };
  }

  const closingLines = lines.slice(zepterIndex, zepterIndex + 2);
  const footerLines = lines.slice(zepterIndex + 2);

  return {
    closingText: closingLines.join("\n").trim(),
    footerNote: footerLines.join(" ").trim(),
  };
};

const generateQualifications = (text) => {
  const normalized = text.toLocaleLowerCase("sr-RS");

  if (
    normalized.includes("development team lead") ||
    normalized.includes("softverske arhitekture") ||
    normalized.includes("digitalne transformacije")
  ) {
    return [
      "IT Leadership",
      "Software Development",
      "Digital Transformation",
      "System Architecture",
    ];
  }

  return [];
};

const generateShortDescription = (name, intro) => {
  if (/development team lead/i.test(name)) {
    return "Liderska pozicija za definisanje tehnološke strategije i vođenje razvoja digitalnih rešenja.";
  }

  const introText = intro.join(" ");
  if (introText) {
    return introText.length > 150 ? `${introText.slice(0, 147).trim()}...` : introText;
  }

  return name ? `Otvorena pozicija za ${name}.` : "";
};

const parseSerbianJobAdText = (text) => {
  const normalizedText = normalizeText(text);

  if (!normalizedText || normalizedText.length < 50) {
    const error = new Error(SELECTABLE_TEXT_ERROR);
    error.statusCode = 400;
    throw error;
  }

  const lines = normalizedText.split("\n").map(normalizeLine).filter(Boolean);
  const name = extractPrefixedValue(lines, "Pozicija");
  const locationLabel = extractPrefixedValue(lines, "Lokacija");

  const sections = {};
  let currentSection = null;

  lines.forEach((line) => {
    const clean = normalizeLine(line);

    if (/^Pozicija\s*:/i.test(clean) || /^Lokacija\s*:/i.test(clean)) {
      return;
    }

    const sectionName = getSectionName(clean);
    if (sectionName) {
      currentSection = sectionName;
      sections[currentSection] = sections[currentSection] || [];
      return;
    }

    if (currentSection) {
      sections[currentSection].push(clean);
    }
  });

  const { aboutZepter, intro } = splitAboutAndIntro(sections.about || []);
  const responsibilities = parseListSection(sections.responsibilities || []);
  const requirements = parseListSection(sections.requirements || [], {
    preserveRequirementHeadings: true,
  });
  const whatZepterOffers = parseListSection(sections.offers || []);
  const howToApply = parseListSection(sections.apply || [], { stopAtClosing: true });
  const closing = extractClosingAndFooter(sections.apply || []);

  return {
    locale: "sr",
    name,
    locationLabel,
    shortDescription: generateShortDescription(name, intro),
    intro,
    whyThisPosition: linesToText(sections.why || []),
    aboutZepter,
    qualifications: generateQualifications(normalizedText),
    responsibilities,
    requirements,
    whatZepterOffers,
    howToApply,
    closingText: closing.closingText,
    footerNote: closing.footerNote,
    applyLabel: "Prijavite se",
  };
};

module.exports = {
  SELECTABLE_TEXT_ERROR,
  normalizeText,
  parseSerbianJobAdText,
};
