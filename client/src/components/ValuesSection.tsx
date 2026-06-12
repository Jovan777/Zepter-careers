import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { publicAssetUrl } from "../config/urls";

const values = [
  {
    icon: publicAssetUrl("/Zepter-Careers images/Heart.png"),
    title: "Zdrav život za sve",
    description: "Zdravlje kao apsolutni prioritet, a ne luksuz.",
  },
  {
    icon: publicAssetUrl("/Zepter-Careers images/Brain.png"),
    title: "Znanja za napredak",
    description: "Kontinuirano učenje kao ključ za vizionarske ideje.",
  },
  {
    icon: publicAssetUrl("/Zepter-Careers images/World.png"),
    title: "Odgovornost prema planeti",
    description: "Zajedno gradimo zdraviju i održiviju budućnost.",
  },
  {
    icon: publicAssetUrl("/Zepter-Careers images/People.png"),
    title: "Snaga različitosti",
    description: "Negujemo individualan pristup zdravijem i kvalitetnijem životu.",
  },
];

const benefits = [
  {
    title: "ZepterClub privilegije",
    description:
      "Mogućnost korišćenja i deljenja ZepterClub pogodnosti sa prijateljima, kupcima i saradnicima.",
  },
  {
    title: "Specijalne cene",
    description: "Svi zaposleni i registrovani članovi imaju mogućnost kupovine Zepter proizvoda po specijalnim cenama i pod povlašćenim uslovima.",
  },
  {
    title: "FitPass popust",
    description: "Pogodnosti za rekreaciju, sport i zdravije svakodnevne navike.",
  },
  {
    title: "Mogućnost rasta",
    description: "Profesionalni razvoj kroz iskustvo, učenje i napredovanje.",
  },
  {
    title: "Fleksibilno radno vreme",
    description: "Bolja organizacija rada i privatnih obaveza.",
  },
  {
    title: "Prodajna i menadžerska provizija",
    description:
      "Mogućnost dodatne zarade kroz prodajne i menadžerske rezultate.",
  },
  {
    title: "Benefitni obroci",
    description: "Obroci iz Zepter Hotel ponude po povoljnijim cenama.",
  },
  {
    title: "Zepter proizvodi u svakodnevici",
    description:
      "Svakodnevno korišćenje proizvoda koji podržavaju zdraviji život.",
  },
];

const ValuesSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const element = sliderRef.current;

    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4
    );
  };

  const scrollBenefits = (direction: "left" | "right") => {
    const element = sliderRef.current;

    if (!element) return;

    element.scrollBy({
      left: direction === "right" ? element.clientWidth : -element.clientWidth,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.35;

    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    updateScrollButtons();

    window.addEventListener("resize", updateScrollButtons);

    return () => {
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <section className="values-section">
      <div className="values-section__inner">
        <h2 className="values-section__title">Naše vrednosti</h2>

        <p className="values-section__subtitle">
          Karijera koja počiva na najčistijim temeljima.
        </p>

        <div className="values-section__grid">
          {values.map((item) => (
            <div key={item.title} className="values-section__item">
              <div className="values-section__icon-wrap">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="values-section__icon"
                />
              </div>

              <h3 className="values-section__item-title">{item.title}</h3>

              <p className="values-section__item-description">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="values-section__benefits-block">
          <div className="values-section__benefits-header">
            <span className="values-section__benefits-kicker">
              Zepter Careers
            </span>

            <h2 className="values-section__benefits-title">
              Zepter Benefiti
            </h2>

            <p className="values-section__benefits-subtitle">
              Pogodnosti koje zaposlenima pružaju dodatnu vrednost, razvoj i
              kvalitetniju svakodnevicu.
            </p>
          </div>

          <div className="values-section__benefits-carousel">
            {canScrollLeft && (
              <button
                type="button"
                className="values-section__benefits-arrow values-section__benefits-arrow--left"
                onClick={() => scrollBenefits("left")}
                aria-label="Prikaži prethodne benefite"
              >
                ‹
              </button>
            )}

            <div
              ref={sliderRef}
              className={`values-section__benefits-track ${
                isDragging ? "values-section__benefits-track--dragging" : ""
              }`}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={updateScrollButtons}
            >
              {benefits.map((benefit, index) => (
                <article
                  key={benefit.title}
                  className="values-section__benefit-card"
                >
                  <div className="values-section__benefit-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="values-section__benefit-title">
                    {benefit.title}
                  </h3>

                  <p className="values-section__benefit-description">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                className="values-section__benefits-arrow values-section__benefits-arrow--right"
                onClick={() => scrollBenefits("right")}
                aria-label="Prikaži sledeće benefite"
              >
                ›
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
