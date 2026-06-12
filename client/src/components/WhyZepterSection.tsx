import { useEffect, useRef, useState } from "react";
import { publicAssetUrl } from "../config/urls";

const stats = [
  { target: 60, suffix: "", label: "Broj zemalja" },
  { target: 400, suffix: "k", label: "Poslovni prostor (m²)" },
  { target: 139, suffix: " k+", label: "Broj konsultanata" },
  { target: 8, suffix: "", label: "Zepter fabrika" },
];

const WhyZepterSection = () => {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  const [displayValues, setDisplayValues] = useState(stats.map(() => 0));
  const [isRolling, setIsRolling] = useState(false);

  const startRollingNumbers = () => {
    if (hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    setIsRolling(true);

    const duration = 1200;
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setDisplayValues(stats.map((item) => item.target));
        setIsRolling(false);
        window.clearInterval(interval);
        return;
      }

      setDisplayValues(
        stats.map((item) => {
          const minimumProgressValue = Math.floor(item.target * progress);

          const randomNoise = Math.floor(
            Math.random() * Math.max(3, item.target * 0.25)
          );

          const nextValue = minimumProgressValue + randomNoise;

          return Math.min(nextValue, item.target);
        })
      );
    }, 25);
  };

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startRollingNumbers();
          observer.disconnect();
        }
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-zepter">
      <div className="container">
        <div className="why-zepter__top">
          <div className="why-zepter__image-wrap">
            <img
              src={publicAssetUrl("/Zepter-Careers images/WhyZepter.png")}
              alt="Why Zepter"
              className="why-zepter__image"
            />
          </div>

          <div className="why-zepter__content">
            <h2 className="why-zepter__title">Zašto Zepter?</h2>

            <p className="why-zepter__text">
              <strong>Ekosistem zdravlja, lepote i dugovečnosti.</strong>{" "}
              Zepter International decenijama pomera granice u razvoju
              tehnologija zdravlja. Nudimo priliku da uz posao postanete deo
              misije posvećene boljem, zdravijem i dužem životu miliona ljudi. Kroz ZepterClub, naš ekosistem povezuje kupce, članove, partnere i konsultante u jedinstvenu mrežu privilegija, preporuka i poslovnih mogućnosti.
            </p>

            <button type="button" className="why-zepter__button">
              <a
                href="https://www.zepter.rs/zepter-world/company-profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Saznaj više</span>
                <span className="why-zepter__button-arrow">›</span>
              </a>
            </button>
          </div>
        </div>

        <div className="why-zepter__stats" ref={statsRef}>
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`why-zepter__stat ${
                index !== stats.length - 1
                  ? "why-zepter__stat--with-border"
                  : ""
              }`}
            >
              <div
                className={`why-zepter__stat-value ${
                  isRolling ? "why-zepter__stat-value--rolling" : ""
                }`}
              >
                {displayValues[index]}
                {item.suffix}
              </div>

              <div className="why-zepter__stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyZepterSection;
