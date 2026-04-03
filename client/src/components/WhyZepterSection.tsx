const stats = [
  { value: "60", label: "Broj zemalja" },
  { value: "400k", label: "Poslovni prostor (m²)" },
  { value: "139 k+", label: "Broj konsultanata" },
  { value: "8", label: "Zepter fabrika" },
];

const WhyZepterSection = () => {
  return (
    <section className="why-zepter">
      <div className="container">
        <div className="why-zepter__top">
          <div className="why-zepter__image-wrap">
            <img
              src="/Zepter-Careers images/WhyZepter.png"
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
              misije posvećene boljem, zdravijem i dužem životu miliona ljudi.
            </p>

            <button type="button" className="why-zepter__button">
              <span>Saznaj više</span>
              <span className="why-zepter__button-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="why-zepter__stats">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`why-zepter__stat ${
                index !== stats.length - 1 ? "why-zepter__stat--with-border" : ""
              }`}
            >
              <div className="why-zepter__stat-value">{item.value}</div>
              <div className="why-zepter__stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyZepterSection;