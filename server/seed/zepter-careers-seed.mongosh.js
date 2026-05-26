// Zepter Careers seed/upsert script for MongoDB Atlas / mongosh
// Generated for Phase 1 + Phase 2 data model.
// Usage:
//   mongosh "mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority" /path/to/zepter-careers-seed.mongosh.js
//
// Notes:
// - This script uses upsert, so it can update existing documents or insert missing ones.
// - It expects company and region documents with the referenced ObjectIds to already exist.
// - It does not reset appliedCount for existing jobs; appliedCount is only set on insert.
// - Change DB_NAME if your Atlas database name is different.

const DB_NAME = "zepter-careers";
const targetDb = db.getSiblingDB(DB_NAME);

const jobs = [
  {
    _id: ObjectId("720000000000000000000001"),
    publicId: "1",
    company: ObjectId("700000000000000000000001"),
    region: ObjectId("710000000000000000000001"),
    workArea: "hr",
    employmentType: "full_time",
    locationType: "hybrid",
    status: "published",
    publishStartAt: new Date("2026-04-01T08:00:00.000Z"),
    publishEndAt: new Date("2026-06-30T20:00:00.000Z"),
    notes: "Primary Serbia HR opening",
    appliedCount: 2,
    createdAt: new Date("2026-04-01T08:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=1&utm_source=qr&utm_medium=print&utm_campaign=job-1",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000002"),
    publicId: "2",
    company: ObjectId("700000000000000000000001"),
    region: ObjectId("710000000000000000000001"),
    workArea: "finance",
    employmentType: "full_time",
    locationType: "onsite",
    status: "published",
    publishStartAt: new Date("2026-04-02T08:00:00.000Z"),
    publishEndAt: new Date("2026-06-30T20:00:00.000Z"),
    notes: "Finance role in Belgrade",
    appliedCount: 1,
    createdAt: new Date("2026-04-02T08:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=2&utm_source=qr&utm_medium=print&utm_campaign=job-2",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000003"),
    publicId: "3",
    company: ObjectId("700000000000000000000002"),
    region: ObjectId("710000000000000000000001"),
    workArea: "sales",
    employmentType: "full_time",
    locationType: "remote",
    status: "published",
    publishStartAt: new Date("2026-04-03T08:00:00.000Z"),
    publishEndAt: new Date("2026-07-15T20:00:00.000Z"),
    notes: "Remote medical sales role",
    appliedCount: 1,
    createdAt: new Date("2026-04-03T08:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=3&utm_source=qr&utm_medium=print&utm_campaign=job-3",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000004"),
    publicId: "4",
    company: ObjectId("700000000000000000000003"),
    region: ObjectId("710000000000000000000001"),
    workArea: "operations",
    employmentType: "part_time",
    locationType: "onsite",
    status: "published",
    publishStartAt: new Date("2026-04-03T10:00:00.000Z"),
    publishEndAt: new Date("2026-06-01T20:00:00.000Z"),
    notes: "Operations support for hotel",
    appliedCount: 0,
    createdAt: new Date("2026-04-03T10:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=4&utm_source=qr&utm_medium=print&utm_campaign=job-4",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000005"),
    publicId: "5",
    company: ObjectId("700000000000000000000001"),
    region: ObjectId("710000000000000000000002"),
    workArea: "finance",
    employmentType: "contract",
    locationType: "hybrid",
    status: "published",
    publishStartAt: new Date("2026-04-01T09:00:00.000Z"),
    publishEndAt: new Date("2026-07-01T20:00:00.000Z"),
    notes: "Poland finance controller",
    appliedCount: 0,
    createdAt: new Date("2026-04-01T09:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=5&utm_source=qr&utm_medium=print&utm_campaign=job-5",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000006"),
    publicId: "6",
    company: ObjectId("700000000000000000000001"),
    region: ObjectId("710000000000000000000003"),
    workArea: "marketing",
    employmentType: "full_time",
    locationType: "hybrid",
    status: "draft",
    publishStartAt: null,
    publishEndAt: null,
    notes: "Draft marketing role for Croatia",
    appliedCount: 0,
    createdAt: new Date("2026-04-04T09:00:00.000Z"),
    updatedAt: new Date("2026-04-04T18:10:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=6&utm_source=qr&utm_medium=print&utm_campaign=job-6",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  },
  {
    _id: ObjectId("720000000000000000000007"),
    publicId: "7",
    company: ObjectId("700000000000000000000001"),
    region: ObjectId("710000000000000000000001"),
    workArea: "it",
    employmentType: "full_time",
    locationType: "onsite",
    status: "published",
    publishStartAt: new Date("2026-04-05T08:00:00.000Z"),
    publishEndAt: new Date("2026-07-31T20:00:00.000Z"),
    notes: "Seeded from Development Team Lead PDF",
    appliedCount: 0,
    createdAt: new Date("2026-04-05T08:00:00.000Z"),
    updatedAt: new Date("2026-04-05T08:00:00.000Z"),
    qr: {
      targetUrl: "https://zepter-careers.vercel.app/jobs?job=7&utm_source=qr&utm_medium=print&utm_campaign=development-team-lead",
      isEnabled: true,
      scanCount: 0
    },
    viewStats: {
      totalViews: 0,
      qrViews: 0
    }
  }
];

const jobTranslations = [
  {
    _id: ObjectId("780000000000000000000001"),
    job: ObjectId("720000000000000000000001"),
    locale: "sr",
    name: "HR poslovni partner",
    locationLabel: "Beograd, Srbija / Hibridno",
    shortDescription: "Strateška HR uloga za podršku menadžmentu, razvoj zaposlenih i unapređenje organizacione kulture u Zepter timu.",
    intro: [
      "Zepter International traži HR poslovnog partnera koji će biti pouzdan oslonac menadžmentu i zaposlenima u svakodnevnim HR procesima.",
      "Ova pozicija povezuje poslovne ciljeve, razvoj ljudi i organizacionu kulturu kroz profesionalan, sistematičan i proaktivan pristup."
    ],
    whyThisPosition: "HR poslovni partner ima važnu ulogu u stvaranju stabilnog, motivišućeg i produktivnog radnog okruženja. Tražimo osobu koja razume potrebe biznisa, ume da gradi poverenje sa timovima i može da prevede HR procese u konkretna rešenja koja podržavaju rast organizacije.",
    aboutZepter: "Zepter International je međunarodna kompanija sa dugom tradicijom, snažnim brendom i poslovanjem koje spaja kvalitet, inovacije i visoke profesionalne standarde. Naši timovi rade u dinamičnom okruženju u kome su odgovornost, inicijativa i razvoj zaposlenih važan deo svakodnevnog rada.",
    qualifications: [
      "HR",
      "People Operations",
      "Employee Relations",
      "Organizational Development"
    ],
    responsibilities: [
      "Saradnja sa menadžmentom u planiranju i realizaciji HR aktivnosti usklađenih sa poslovnim ciljevima",
      "Podrška rukovodiocima u procesima zapošljavanja, onboardinga, razvoja zaposlenih i upravljanja učinkom",
      "Praćenje potreba zaposlenih i predlaganje mera za unapređenje angažovanosti i organizacione kulture",
      "Učešće u pripremi i unapređenju HR procedura, politika i internih komunikacija",
      "Analiza HR pokazatelja i priprema preporuka za unapređenje procesa",
      "Podrška u rešavanju radno-pravnih i organizacionih pitanja u saradnji sa relevantnim službama"
    ],
    requirements: [
      "Iskustvo i znanje:",
      "Minimum 3 godine iskustva u HR funkciji, idealno na poziciji HR Business Partnera ili sličnoj ulozi",
      "Dobro razumevanje procesa zapošljavanja, razvoja zaposlenih, evaluacije učinka i internih HR procedura",
      "Poznavanje radno-pravnih propisa i primene HR politika u poslovnom okruženju",
      "Iskustvo u radu sa menadžerima i pružanju savetodavne podrške timovima",
      "Profesionalne kompetencije:",
      "Razvijene komunikacione i savetodavne veštine",
      "Diskrecija, pouzdanost i visok nivo profesionalne odgovornosti",
      "Sposobnost organizacije, prioritizacije i rada sa više paralelnih tema",
      "Analitičan pristup i spremnost za predlaganje praktičnih rešenja",
      "Prednost:",
      "Iskustvo u međunarodnom ili kompleksnom poslovnom sistemu predstavlja prednost"
    ],
    whatZepterOffers: [
      "Stabilno radno okruženje u međunarodnoj kompaniji sa prepoznatljivim brendom",
      "Mogućnost uticaja na razvoj HR praksi i organizacione kulture",
      "Saradnju sa iskusnim menadžmentom i različitim poslovnim timovima",
      "Profesionalni razvoj kroz rad na konkretnim HR projektima",
      "Dinamičan posao sa visokim nivoom odgovornosti i samostalnosti"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "",
    applyLabel: "Prijavite se",
    notes: "Primary Serbian translation",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000002"),
    job: ObjectId("720000000000000000000001"),
    locale: "en",
    name: "HR Business Partner",
    locationLabel: "Belgrade, Serbia / Hybrid",
    shortDescription: "A strategic HR role focused on management support, employee development and strengthening Zepter’s organizational culture.",
    intro: [
      "Zepter International is looking for an HR Business Partner who will provide reliable support to managers and employees across core HR processes.",
      "This role connects business goals, people development and organizational culture through a professional, structured and proactive approach."
    ],
    whyThisPosition: "The HR Business Partner plays an important role in building a stable, motivating and productive work environment. We are looking for someone who understands business needs, builds trust with teams and turns HR processes into practical solutions that support organizational growth.",
    aboutZepter: "Zepter International is an international company with a long tradition, a strong brand and business standards built around quality, innovation and professionalism. Our teams work in a dynamic environment where responsibility, initiative and employee development matter every day.",
    qualifications: [
      "HR",
      "People Operations",
      "Employee Relations",
      "Organizational Development"
    ],
    responsibilities: [
      "Partner with management to plan and deliver HR activities aligned with business goals",
      "Support managers in recruitment, onboarding, employee development and performance management processes",
      "Monitor employee needs and propose actions to improve engagement and organizational culture",
      "Contribute to HR procedures, policies and internal communication improvements",
      "Analyze HR indicators and prepare recommendations for process improvement",
      "Support employee relations and organizational topics in cooperation with relevant teams"
    ],
    requirements: [
      "Experience and knowledge:",
      "Minimum 3 years of experience in HR, ideally as an HR Business Partner or in a similar role",
      "Good understanding of recruitment, employee development, performance review and HR procedure processes",
      "Knowledge of labor regulations and practical HR policy implementation",
      "Experience advising managers and supporting business teams",
      "Professional competencies:",
      "Strong communication and advisory skills",
      "Discretion, reliability and a high level of professional responsibility",
      "Ability to organize priorities and manage several topics in parallel",
      "Analytical approach and readiness to propose practical solutions",
      "Advantage:",
      "Experience in an international or complex business system is an advantage"
    ],
    whatZepterOffers: [
      "Stable work environment in an international company with a recognized brand",
      "Opportunity to influence HR practices and organizational culture",
      "Cooperation with experienced management and diverse business teams",
      "Professional development through practical HR projects",
      "Dynamic work with a high level of responsibility and independence"
    ],
    howToApply: [
      "CV with details about professional experience and education",
      "Motivation letter, if relevant for the position"
    ],
    closingText: "Zepter International\nLive better - live longer and healthier!",
    footerNote: "",
    applyLabel: "Apply",
    notes: "English translation",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000003"),
    job: ObjectId("720000000000000000000002"),
    locale: "sr",
    name: "Finansijski kontrolor",
    locationLabel: "Beograd, Srbija",
    shortDescription: "Finansijska kontroling pozicija usmerena na izveštavanje, analizu performansi i podršku donošenju poslovnih odluka.",
    intro: [
      "Zepter International zapošljava finansijskog kontrolora koji će učestvovati u izradi izveštaja, analiza i planova važnih za upravljanje poslovanjem.",
      "Pozicija je namenjena kandidatu koji razume finansijske pokazatelje, voli tačnost i želi da doprinese kvalitetnijem planiranju i kontroli rezultata."
    ],
    whyThisPosition: "Finansijski kontrolor obezbeđuje menadžmentu jasne, pravovremene i upotrebljive informacije za donošenje odluka. Uloga je važna za praćenje profitabilnosti, kontrolu troškova i unapređenje finansijske discipline u poslovnom sistemu.",
    aboutZepter: "Zepter International posluje na više tržišta i razvija različite poslovne segmente, zbog čega su kvalitetno finansijsko praćenje, transparentno izveštavanje i odgovorno planiranje ključni deo stabilnog rasta kompanije.",
    qualifications: [
      "Finance",
      "Controlling",
      "Reporting",
      "Analysis"
    ],
    responsibilities: [
      "Priprema mesečnih, kvartalnih i godišnjih finansijskih izveštaja za potrebe menadžmenta",
      "Analiza prihoda, troškova, marži i odstupanja u odnosu na plan i prethodne periode",
      "Učešće u procesu budžetiranja, forecast-a i praćenja realizacije planova",
      "Kontrola tačnosti finansijskih podataka i saradnja sa računovodstvom i drugim sektorima",
      "Izrada ad hoc analiza i preporuka za unapređenje profitabilnosti i efikasnosti",
      "Praćenje ključnih finansijskih pokazatelja i priprema preglednih prezentacija za menadžment"
    ],
    requirements: [
      "Obrazovanje i iskustvo:",
      "Visoko obrazovanje iz oblasti ekonomije, finansija, računovodstva ili srodnih oblasti",
      "Minimum 3 godine iskustva u finansijskoj analizi, kontrolingu, reviziji ili računovodstvu",
      "Iskustvo u pripremi finansijskih izveštaja, budžeta i analiza odstupanja",
      "Tehnička znanja:",
      "Napredno poznavanje Excel-a i rada sa finansijskim modelima",
      "Razumevanje bilansa uspeha, bilansa stanja, cash flow-a i osnovnih računovodstvenih principa",
      "Iskustvo u radu sa ERP sistemima ili poslovnim aplikacijama predstavlja prednost",
      "Profesionalne kompetencije:",
      "Analitičnost, preciznost i pažnja prema detaljima",
      "Sposobnost jasnog predstavljanja finansijskih zaključaka nefinsijskim korisnicima",
      "Odgovornost, organizovanost i poštovanje rokova"
    ],
    whatZepterOffers: [
      "Odgovornu poziciju u stabilnom međunarodnom poslovnom sistemu",
      "Mogućnost rada na finansijskim analizama koje direktno podržavaju poslovne odluke",
      "Saradnju sa iskusnim finansijskim i menadžerskim timovima",
      "Profesionalni razvoj u oblasti kontrolinga, izveštavanja i planiranja",
      "Dinamično okruženje sa jasnim procesima i visokim standardima rada"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "",
    applyLabel: "Prijavite se",
    notes: "",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000004"),
    job: ObjectId("720000000000000000000002"),
    locale: "en",
    name: "Financial Controller",
    locationLabel: "Belgrade, Serbia",
    shortDescription: "Financial controlling role focused on reporting, performance analysis and support for business decision-making.",
    intro: [
      "Zepter International is hiring a Financial Controller to support reporting, analysis and planning processes important for business management.",
      "The role is ideal for a candidate who understands financial indicators, values accuracy and wants to contribute to better planning and performance control."
    ],
    whyThisPosition: "The Financial Controller provides management with clear, timely and useful information for decision-making. The role is important for monitoring profitability, controlling costs and improving financial discipline within the business system.",
    aboutZepter: "Zepter International operates across multiple markets and business segments, making high-quality financial monitoring, transparent reporting and responsible planning essential to stable company growth.",
    qualifications: [
      "Finance",
      "Controlling",
      "Reporting",
      "Analysis"
    ],
    responsibilities: [
      "Prepare monthly, quarterly and annual financial reports for management needs",
      "Analyze revenue, costs, margins and variances compared with plans and previous periods",
      "Participate in budgeting, forecasting and plan realization monitoring",
      "Control financial data accuracy and cooperate with accounting and other departments",
      "Prepare ad hoc analyses and recommendations to improve profitability and efficiency",
      "Track key financial indicators and prepare clear presentations for management"
    ],
    requirements: [
      "Education and experience:",
      "University degree in economics, finance, accounting or a related field",
      "Minimum 3 years of experience in financial analysis, controlling, audit or accounting",
      "Experience preparing financial reports, budgets and variance analyses",
      "Technical knowledge:",
      "Advanced Excel skills and experience working with financial models",
      "Understanding of income statement, balance sheet, cash flow and core accounting principles",
      "Experience with ERP systems or business applications is an advantage",
      "Professional competencies:",
      "Analytical mindset, precision and attention to detail",
      "Ability to present financial conclusions clearly to non-financial stakeholders",
      "Responsibility, organization and respect for deadlines"
    ],
    whatZepterOffers: [
      "Responsible role in a stable international business system",
      "Opportunity to work on financial analyses that directly support business decisions",
      "Cooperation with experienced finance and management teams",
      "Professional growth in controlling, reporting and planning",
      "Dynamic environment with clear processes and high working standards"
    ],
    howToApply: [
      "CV with details about professional experience and education",
      "Motivation letter, if relevant for the position"
    ],
    closingText: "Zepter International\nLive better - live longer and healthier!",
    footerNote: "",
    applyLabel: "Apply",
    notes: "",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000005"),
    job: ObjectId("720000000000000000000003"),
    locale: "sr",
    name: "Specijalista prodaje medicinskih rešenja",
    locationLabel: "Remote / Srbija",
    shortDescription: "Prodajna pozicija za razvoj tržišta medicinskih rešenja, rad sa klijentima i predstavljanje Zepter kvaliteta u zdravstvenom segmentu.",
    intro: [
      "Zepter Medical traži specijalistu prodaje medicinskih rešenja koji će razvijati odnose sa klijentima i predstavljati portfolio proizvoda namenjen zdravstvenim i profesionalnim korisnicima.",
      "Pozicija kombinuje prodajne veštine, savetodavni pristup i razumevanje potreba tržišta medicinskih i wellness rešenja."
    ],
    whyThisPosition: "Ova uloga je važna za širenje prisustva Zepter Medical rešenja i izgradnju dugoročnih odnosa sa kupcima. Tražimo osobu koja ume da prepozna potrebe klijenata, predstavi vrednost proizvoda i vodi prodajni proces odgovorno i profesionalno.",
    aboutZepter: "Zepter Medical je deo Zepter sistema, poznatog po proizvodima visokog kvaliteta, inovacijama i posvećenosti unapređenju kvaliteta života. Kroz profesionalan pristup tržištu razvijamo rešenja koja podržavaju zdravije i kvalitetnije svakodnevno funkcionisanje.",
    qualifications: [
      "Sales",
      "Medical Solutions",
      "Client Relations",
      "Business Development"
    ],
    responsibilities: [
      "Razvoj i održavanje odnosa sa postojećim i potencijalnim klijentima u medicinskom i wellness segmentu",
      "Prezentacija proizvoda, rešenja i koristi za profesionalne korisnike i poslovne partnere",
      "Identifikacija prodajnih prilika i aktivno upravljanje prodajnim levkom",
      "Priprema ponuda, praćenje pregovora i koordinacija realizacije dogovorenih aktivnosti",
      "Praćenje tržišnih trendova, konkurencije i potreba klijenata",
      "Saradnja sa internim timovima radi kvalitetne podrške kupcima i realizacije prodajnih ciljeva"
    ],
    requirements: [
      "Iskustvo i znanje:",
      "Minimum 2 godine iskustva u prodaji, razvoju poslovanja ili radu sa klijentima",
      "Iskustvo u medicinskom, farmaceutskom, wellness ili B2B segmentu predstavlja prednost",
      "Razumevanje prodajnog procesa, pregovaranja i rada sa prodajnim ciljevima",
      "Profesionalne kompetencije:",
      "Izražene komunikacione, prezentacione i pregovaračke veštine",
      "Proaktivan pristup, samostalnost i orijentisanost na rezultat",
      "Sposobnost izgradnje poverenja i dugoročnih odnosa sa klijentima",
      "Organizovanost i uredno praćenje prodajnih aktivnosti",
      "Prednost:",
      "Poznavanje tržišta medicinskih uređaja, zdravstvenih ustanova ili profesionalnih wellness rešenja"
    ],
    whatZepterOffers: [
      "Mogućnost razvoja prodaje kvalitetnih medicinskih i wellness rešenja",
      "Rad u međunarodnom sistemu sa jakim brendom i prepoznatljivim standardima",
      "Podršku iskusnog tima i pristup relevantnim prodajnim materijalima",
      "Dinamičan posao sa visokim nivoom kontakta sa klijentima",
      "Mogućnost profesionalnog razvoja u oblasti prodaje i poslovnog razvoja"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "",
    applyLabel: "Prijavite se",
    notes: "",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000006"),
    job: ObjectId("720000000000000000000003"),
    locale: "en",
    name: "Medical Solutions Sales Specialist",
    locationLabel: "Remote / Serbia",
    shortDescription: "Sales role focused on developing the market for medical solutions, client relationships and representing Zepter quality in the healthcare segment.",
    intro: [
      "Zepter Medical is looking for a Medical Solutions Sales Specialist to develop client relationships and present a product portfolio for healthcare and professional users.",
      "The role combines sales skills, a consultative approach and understanding of the medical and wellness solutions market."
    ],
    whyThisPosition: "This role is important for expanding the presence of Zepter Medical solutions and building long-term customer relationships. We are looking for someone who can identify client needs, present product value and manage the sales process responsibly and professionally.",
    aboutZepter: "Zepter Medical is part of the Zepter system, known for high-quality products, innovation and commitment to improving quality of life. Through a professional market approach, we develop solutions that support healthier and better everyday living.",
    qualifications: [
      "Sales",
      "Medical Solutions",
      "Client Relations",
      "Business Development"
    ],
    responsibilities: [
      "Develop and maintain relationships with existing and potential clients in the medical and wellness segment",
      "Present products, solutions and benefits to professional users and business partners",
      "Identify sales opportunities and actively manage the sales pipeline",
      "Prepare offers, follow negotiations and coordinate agreed activities",
      "Monitor market trends, competitors and client needs",
      "Cooperate with internal teams to ensure quality customer support and sales goal realization"
    ],
    requirements: [
      "Experience and knowledge:",
      "Minimum 2 years of experience in sales, business development or client-facing work",
      "Experience in medical, pharmaceutical, wellness or B2B segments is an advantage",
      "Understanding of sales processes, negotiation and target-oriented work",
      "Professional competencies:",
      "Strong communication, presentation and negotiation skills",
      "Proactive approach, independence and result orientation",
      "Ability to build trust and long-term relationships with clients",
      "Organization and accurate tracking of sales activities",
      "Advantage:",
      "Knowledge of the medical device, healthcare institution or professional wellness solutions market"
    ],
    whatZepterOffers: [
      "Opportunity to develop sales of high-quality medical and wellness solutions",
      "Work in an international system with a strong brand and recognized standards",
      "Support from an experienced team and access to relevant sales materials",
      "Dynamic work with a high level of client interaction",
      "Professional development in sales and business development"
    ],
    howToApply: [
      "CV with details about professional experience and education",
      "Motivation letter, if relevant for the position"
    ],
    closingText: "Zepter International\nLive better - live longer and healthier!",
    footerNote: "",
    applyLabel: "Apply",
    notes: "",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000007"),
    job: ObjectId("720000000000000000000004"),
    locale: "sr",
    name: "Operativni asistent",
    locationLabel: "Beograd, Srbija",
    shortDescription: "Operativna podrška hotelskim i administrativnim timovima kroz organizovan rad, tačnu komunikaciju i praćenje dnevnih zadataka.",
    intro: [
      "Hotel Zepter traži operativnog asistenta koji će pružati svakodnevnu podršku timovima hotela i administracije.",
      "Pozicija je pogodna za organizovane, pouzdane i komunikativne kandidate koji žele da doprinesu urednom funkcionisanju operativnih procesa."
    ],
    whyThisPosition: "Operativni asistent je važna podrška timovima koji svakodnevno rade sa gostima, dokumentacijom i internim zahtevima. Uloga zahteva preciznost, dobru organizaciju i spremnost da se zadaci prate od početka do završetka.",
    aboutZepter: "Hotel Zepter posluje u okviru Zepter sistema i pruža usluge uz visok standard kvaliteta, profesionalnosti i pažnje prema korisničkom iskustvu. Naš tim neguje odgovoran pristup radu i jasnu internu komunikaciju.",
    qualifications: [
      "Operations",
      "Administration",
      "Coordination",
      "Hospitality"
    ],
    responsibilities: [
      "Pružanje administrativne i operativne podrške hotelskim i internim timovima",
      "Koordinacija dnevnih zadataka, evidencija i internih zahteva",
      "Komunikacija sa zaposlenima, saradnicima i po potrebi eksternim partnerima",
      "Priprema, obrada i arhiviranje dokumentacije u skladu sa internim procedurama",
      "Praćenje rokova i pomoć u organizaciji sastanaka, materijala i operativnih aktivnosti",
      "Podrška u rešavanju svakodnevnih organizacionih pitanja"
    ],
    requirements: [
      "Iskustvo i znanje:",
      "Iskustvo na administrativnim, operativnim ili asistentskim poslovima predstavlja prednost",
      "Dobro poznavanje rada na računaru i osnovnih kancelarijskih alata",
      "Razumevanje administrativnih procesa i urednog vođenja dokumentacije",
      "Profesionalne kompetencije:",
      "Organizovanost, pouzdanost i pažnja prema detaljima",
      "Ljubazna i jasna komunikacija",
      "Spremnost za rad u dinamičnom okruženju i podršku različitim timovima",
      "Odgovornost u radu sa informacijama i poštovanje dogovorenih rokova"
    ],
    whatZepterOffers: [
      "Stabilno i profesionalno radno okruženje u okviru Zepter sistema",
      "Mogućnost učenja kroz rad sa iskusnim hotelskim i administrativnim timovima",
      "Jasne procedure i podršku u svakodnevnom radu",
      "Priliku za razvoj organizacionih i komunikacionih veština",
      "Rad u timu koji neguje kvalitet usluge i odgovornost"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "",
    applyLabel: "Prijavite se",
    notes: "",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000008"),
    job: ObjectId("720000000000000000000005"),
    locale: "en",
    name: "Finance Manager",
    locationLabel: "Warsaw, Poland / Hybrid",
    shortDescription: "Senior finance leadership role responsible for financial planning, reporting, controls and business support in an international environment.",
    intro: [
      "Zepter International is looking for a Finance Manager to lead key finance processes and provide reliable financial insight for business decisions.",
      "The role combines operational finance management, reporting discipline and strategic support to management."
    ],
    whyThisPosition: "The Finance Manager ensures that financial processes are accurate, timely and aligned with business priorities. This position is important for planning, performance monitoring, control of financial risks and supporting sustainable growth.",
    aboutZepter: "Zepter International operates across multiple markets and business areas, with a strong focus on quality, responsible management and long-term development. Finance plays a central role in ensuring transparency, stability and informed decision-making.",
    qualifications: [
      "Finance Management",
      "Planning",
      "Reporting",
      "Leadership"
    ],
    responsibilities: [
      "Lead financial planning, budgeting, forecasting and management reporting processes",
      "Monitor financial performance, cash flow, profitability and key business indicators",
      "Coordinate accounting, controlling and reporting activities with internal and external stakeholders",
      "Develop financial analyses and recommendations for management decisions",
      "Ensure compliance with internal controls, policies and relevant financial standards",
      "Support process improvements, system use and financial discipline across the organization",
      "Manage priorities within the finance function and support cooperation across departments"
    ],
    requirements: [
      "Experience and knowledge:",
      "University degree in finance, economics, accounting or a related field",
      "Minimum 5 years of relevant experience in finance, controlling, accounting or audit",
      "Experience in financial management, budgeting, reporting and cash flow monitoring",
      "Strong understanding of financial statements, internal controls and business analysis",
      "Professional competencies:",
      "Leadership ability and readiness to coordinate finance priorities",
      "Analytical thinking, accuracy and strong business judgment",
      "Clear communication with management and non-financial stakeholders",
      "Ability to work under deadlines and manage confidential information responsibly",
      "Advantage:",
      "Experience in an international company, ERP environment or multi-entity reporting is an advantage"
    ],
    whatZepterOffers: [
      "Senior finance role in an international company with a recognized brand",
      "Opportunity to influence financial planning, reporting and business decision support",
      "Cooperation with management and cross-functional teams",
      "Professional development through complex finance and controlling topics",
      "Stable environment with responsibility, autonomy and high standards"
    ],
    howToApply: [
      "CV with details about professional experience and education",
      "Motivation letter, if relevant for the position"
    ],
    closingText: "Zepter International\nLive better - live longer and healthier!",
    footerNote: "",
    applyLabel: "Apply",
    notes: "Poland role",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000009"),
    job: ObjectId("720000000000000000000006"),
    locale: "sr",
    name: "Marketing specijalista",
    locationLabel: "Zagreb, Hrvatska / Hibridno",
    shortDescription: "Marketing pozicija za planiranje kampanja, kreiranje sadržaja i podršku brend komunikaciji kroz digitalne i tradicionalne kanale.",
    intro: [
      "Zepter International traži marketing specijalistu koji će učestvovati u planiranju i realizaciji marketinških aktivnosti za brend, proizvode i prodajne kanale.",
      "Pozicija je namenjena kreativnoj i organizovanoj osobi koja razume komunikaciju sa tržištem i želi da doprinese vidljivosti i doslednosti brenda."
    ],
    whyThisPosition: "Marketing specijalista ima važnu ulogu u povezivanju brenda sa kupcima, partnerima i internim timovima. Kroz kampanje, sadržaj i koordinaciju aktivnosti, ova pozicija doprinosi jasnoj komunikaciji vrednosti Zepter proizvoda i jačanju tržišnog prisustva.",
    aboutZepter: "Zepter International je globalno prepoznat brend sa širokim portfoliom proizvoda i dugom tradicijom kvaliteta. Marketing tim podržava komunikaciju inovacija, zdravijeg načina života i profesionalnih standarda koji čine osnovu Zepter identiteta.",
    qualifications: [
      "Marketing",
      "Campaigns",
      "Content",
      "Brand Communication"
    ],
    responsibilities: [
      "Planiranje i realizacija marketinških kampanja u skladu sa brend i prodajnim ciljevima",
      "Kreiranje i koordinacija sadržaja za digitalne kanale, prezentacije, materijale i interne komunikacije",
      "Saradnja sa prodajnim, dizajnerskim i drugim timovima na pripremi promotivnih aktivnosti",
      "Praćenje rezultata kampanja i priprema predloga za unapređenje komunikacije",
      "Upravljanje rasporedom aktivnosti, rokovima i osnovnom produkcijom marketinških materijala",
      "Praćenje tržišnih trendova i konkurentskih aktivnosti relevantnih za brend"
    ],
    requirements: [
      "Iskustvo i znanje:",
      "Minimum 2 godine iskustva u marketingu, komunikacijama, digitalnom marketingu ili radu sa brendom",
      "Razumevanje planiranja kampanja, kreiranja sadržaja i osnovnih marketinških kanala",
      "Iskustvo u radu sa društvenim mrežama, prezentacijama i promotivnim materijalima",
      "Profesionalne kompetencije:",
      "Kreativnost, organizovanost i pažnja prema detaljima",
      "Sposobnost jasnog pisanja i prilagođavanja poruke različitim kanalima",
      "Proaktivan pristup i spremnost za koordinaciju više aktivnosti istovremeno",
      "Dobra saradnja sa internim timovima i eksternim saradnicima",
      "Prednost:",
      "Poznavanje alata za digitalni marketing, analitiku ili osnovni dizajn predstavlja prednost"
    ],
    whatZepterOffers: [
      "Rad na komunikaciji međunarodno prepoznatog brenda",
      "Mogućnost učešća u različitim kampanjama, događajima i promotivnim aktivnostima",
      "Saradnju sa prodajnim, dizajnerskim i menadžerskim timovima",
      "Prostor za kreativnost, učenje i profesionalni razvoj",
      "Dinamično okruženje sa jasnim ciljevima i visokim standardima brend komunikacije"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "",
    applyLabel: "Prijavite se",
    notes: "Draft translation",
    createdAt: new Date("2026-04-04T18:15:00.000Z"),
    updatedAt: new Date("2026-04-04T18:15:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000010"),
    job: ObjectId("720000000000000000000007"),
    locale: "sr",
    name: "Development Team Lead",
    locationLabel: "Beograd, Srbija",
    shortDescription: "Liderska IT pozicija za definisanje tehnološke strategije i vođenje razvoja novih digitalnih i sistemskih rešenja.",
    intro: [
      "U cilju daljeg razvoja tehnoloških kapaciteta kompanije i unapređenja digitalnih rešenja koja podržavaju poslovne procese i rast organizacije, raspisujemo konkurs za poziciju Development Team Lead.",
      "Development Team Lead će imati ključnu ulogu u definisanju tehnološke strategije i vođenju razvoja novih digitalnih i sistemskih rešenja."
    ],
    whyThisPosition: "Pozicija Development Team Lead predstavlja stratešku funkciju koja povezuje poslovne ciljeve kompanije sa tehnološkim razvojem i inovacijama. Tražimo profesionalca koji razume savremene tehnologije, poseduje strateško razmišljanje i sposobnost vođenja kompleksnih razvojnih inicijativa. Ovo je prilika za lidera koji želi da aktivno učestvuje u oblikovanju tehnološke budućnosti kompanije i unapređenju sistema koji podržavaju poslovanje na međunarodnom nivou.",
    aboutZepter: "Zepter International je međunarodna kompanija prisutna u više od 60 zemalja sveta, prepoznata po vrhunskom kvalitetu proizvoda i snažnoj viziji unapređenja kvaliteta života ljudi. Naše poslovanje zasniva se na inovacijama, dugoročnom razvoju i visokim profesionalnim standardima.",
    qualifications: [
      "IT Leadership",
      "Software Development",
      "Digital Transformation",
      "System Architecture"
    ],
    responsibilities: [
      "Definisanje i sprovođenje tehnološke strategije u skladu sa poslovnim ciljevima kompanije",
      "Planiranje i vođenje razvoja novih digitalnih rešenja i tehnoloških projekata",
      "Identifikacija prilika za unapređenje postojećih sistema i procesa kroz primenu novih tehnologija",
      "Upravljanje razvojnim inicijativama i koordinacija timova uključenih u implementaciju tehnoloških rešenja",
      "Saradnja sa menadžmentom i poslovnim sektorima u definisanju tehnoloških prioriteta",
      "Praćenje tehnoloških trendova i inovacija relevantnih za poslovanje kompanije",
      "Definisanje tehničkih standarda, arhitekture sistema i razvojnih smernica",
      "Upravljanje odnosima sa eksternim partnerima i tehnološkim dobavljačima",
      "Praćenje realizacije projekata u skladu sa planiranim rokovima, budžetima i kvalitetom isporuke",
      "Učešće u procesima digitalne transformacije i unapređenja IT infrastrukture i aplikacija"
    ],
    requirements: [
      "Obrazovanje i iskustvo:",
      "Završeno visoko obrazovanje iz oblasti informacionih tehnologija, računarstva, softverskog inženjerstva ili srodnih oblasti",
      "Minimum 7–10 godina iskustva u oblasti razvoja softvera, IT sistema ili tehnoloških projekata",
      "Minimum 3–5 godina iskustva na liderskoj ili rukovodećoj poziciji u IT ili tehnološkom okruženju",
      "Iskustvo u definisanju tehnološke strategije i vođenju razvojnih projekata",
      "Iskustvo u radu sa kompleksnim informacionim sistemima i integracijama",
      "Tehnička znanja i kompetencije:",
      "Razumevanje softverske arhitekture, razvoja aplikacija i sistemske integracije",
      "Iskustvo na poziciji Full-stack developera",
      "Poznavanje C#, Angular, ASP.NET, JavaScript, MSSQL, PostgreSQL, CSS, React, React Native, SQL",
      "Razumevanje CI/CD pipeline-ova i release procesa",
      "Iskustvo u razvoju API endpointa",
      "Iskustvo u razvoju web i mobilnih platformi",
      "Iskustvo u upravljanju razvojnim timovima i tehnološkim projektima",
      "Poznavanje modernih tehnologija i razvojnih okruženja",
      "Razumevanje principa digitalne transformacije i optimizacije poslovnih procesa",
      "Iskustvo u radu sa bazama podataka i poslovnim aplikacijama",
      "Poznavanje cloud tehnologija, API integracija i bezbednosnih standarda predstavlja prednost",
      "Profesionalne kompetencije:",
      "Strateško razmišljanje i sposobnost planiranja dugoročnog razvoja sistema",
      "Razvijene liderske i organizacione sposobnosti",
      "Sposobnost donošenja odluka i upravljanja prioritetima",
      "Analitički pristup rešavanju problema",
      "Izražene komunikacione i pregovaračke veštine",
      "Visok nivo odgovornosti i profesionalizma",
      "Poznavanje cloud tehnologija, API integracija i bezbednosnih standarda predstavlja prednost"
    ],
    whatZepterOffers: [
      "Odgovornu i strateški značajnu poziciju u međunarodnoj kompaniji",
      "Mogućnost aktivnog učešća u razvoju i implementaciji tehnoloških rešenja",
      "Rad u profesionalnom i dinamičnom poslovnom okruženju",
      "Učešće u projektima digitalne transformacije i unapređenja poslovnih sistema",
      "Mogućnost profesionalnog razvoja i usavršavanja",
      "Paket beneficija u skladu sa senioritetom i rezultatima"
    ],
    howToApply: [
      "CV sa detaljima o profesionalnom iskustvu i obrazovanju",
      "Motivaciono pismo, ukoliko je relevantno za poziciju"
    ],
    closingText: "Zepter International\nŽivi bolje - živi duže zdravije!",
    footerNote: "Odjava iz ZepterCluba je bezuslovna i bez ikakvih obaveza.",
    applyLabel: "Prijavite se",
    notes: "Seeded from Development Team Lead PDF",
    createdAt: new Date("2026-04-05T08:00:00.000Z"),
    updatedAt: new Date("2026-04-05T08:00:00.000Z")
  },
  {
    _id: ObjectId("780000000000000000000011"),
    job: ObjectId("720000000000000000000007"),
    locale: "en",
    name: "Development Team Lead",
    locationLabel: "Belgrade, Serbia",
    shortDescription: "Technology leadership role focused on defining strategy and leading the development of new digital and system solutions.",
    intro: [
      "To further develop the company’s technology capabilities and improve digital solutions that support business processes and organizational growth, Zepter is opening the Development Team Lead position.",
      "The Development Team Lead will play a key role in defining technology strategy and leading the development of new digital and system solutions."
    ],
    whyThisPosition: "The Development Team Lead position is a strategic function connecting business goals with technology development and innovation. We are looking for a professional who understands modern technologies, thinks strategically and can lead complex development initiatives that support business on an international level.",
    aboutZepter: "Zepter International is an international company present in more than 60 countries, recognized for product quality and a strong vision of improving quality of life. Our business is based on innovation, long-term development and high professional standards.",
    qualifications: [
      "IT Leadership",
      "Software Development",
      "Digital Transformation",
      "System Architecture"
    ],
    responsibilities: [
      "Define and implement technology strategy aligned with company business goals",
      "Plan and lead the development of new digital solutions and technology projects",
      "Identify opportunities to improve existing systems and processes through new technologies",
      "Manage development initiatives and coordinate teams involved in implementing technology solutions",
      "Cooperate with management and business departments in defining technology priorities",
      "Monitor technology trends and innovations relevant to the company’s business",
      "Define technical standards, system architecture and development guidelines",
      "Manage relationships with external partners and technology suppliers",
      "Monitor project delivery according to planned deadlines, budgets and quality standards",
      "Participate in digital transformation and improvement of IT infrastructure and applications"
    ],
    requirements: [
      "Education and experience:",
      "University degree in information technology, computer science, software engineering or related fields",
      "Minimum 7–10 years of experience in software development, IT systems or technology projects",
      "Minimum 3–5 years of experience in a leadership or management role in an IT or technology environment",
      "Experience defining technology strategy and leading development projects",
      "Experience working with complex information systems and integrations",
      "Technical knowledge and competencies:",
      "Understanding of software architecture, application development and system integration",
      "Experience as a Full-stack developer",
      "Knowledge of C#, Angular, ASP.NET, JavaScript, MSSQL, PostgreSQL, CSS, React, React Native, SQL",
      "Understanding of CI/CD pipelines and release processes",
      "Experience developing API endpoints",
      "Experience developing web and mobile platforms",
      "Experience managing development teams and technology projects",
      "Knowledge of modern technologies and development environments",
      "Understanding of digital transformation principles and business process optimization",
      "Experience with databases and business applications",
      "Knowledge of cloud technologies, API integrations and security standards is an advantage",
      "Professional competencies:",
      "Strategic thinking and ability to plan long-term system development",
      "Developed leadership and organizational abilities",
      "Ability to make decisions and manage priorities",
      "Analytical approach to problem solving",
      "Strong communication and negotiation skills",
      "High level of responsibility and professionalism"
    ],
    whatZepterOffers: [
      "A responsible and strategically important position in an international company",
      "Opportunity to actively participate in the development and implementation of technology solutions",
      "Work in a professional and dynamic business environment",
      "Participation in digital transformation and business system improvement projects",
      "Professional growth and development opportunities",
      "Benefits package aligned with seniority and results"
    ],
    howToApply: [
      "CV with details about professional experience and education",
      "Motivation letter, if relevant for the position"
    ],
    closingText: "Zepter International\nLive better - live longer and healthier!",
    footerNote: "",
    applyLabel: "Apply",
    notes: "English adaptation of Development Team Lead PDF",
    createdAt: new Date("2026-04-05T08:00:00.000Z"),
    updatedAt: new Date("2026-04-05T08:00:00.000Z")
  }
];

function prepareJobUpdate(job) {
  const { _id, appliedCount, createdAt, ...setFields } = job;

  return {
    updateOne: {
      filter: { publicId: job.publicId },
      update: {
        $set: {
          ...setFields,
          updatedAt: job.updatedAt || new Date()
        },
        $setOnInsert: {
          _id,
          appliedCount: appliedCount ?? 0,
          createdAt: createdAt || new Date()
        }
      },
      upsert: true
    }
  };
}

function prepareTranslationUpdate(translation) {
  const { _id, createdAt, ...setFields } = translation;

  return {
    updateOne: {
      filter: {
        job: translation.job,
        locale: translation.locale
      },
      update: {
        $set: {
          ...setFields,
          updatedAt: translation.updatedAt || new Date()
        },
        $setOnInsert: {
          _id,
          createdAt: createdAt || new Date()
        }
      },
      upsert: true
    }
  };
}

print(`Using database: ${DB_NAME}`);
print(`Preparing ${jobs.length} jobs and ${jobTranslations.length} job translations...`);

const jobsResult = targetDb.jobs.bulkWrite(jobs.map(prepareJobUpdate), { ordered: false });
const translationsResult = targetDb.jobTranslations.bulkWrite(jobTranslations.map(prepareTranslationUpdate), { ordered: false });

print("Jobs upsert result:");
printjson(jobsResult);

print("Job translations upsert result:");
printjson(translationsResult);

print("Zepter Careers seed completed.");
