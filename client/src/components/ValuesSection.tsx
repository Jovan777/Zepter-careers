const values = [
  {
    icon: "/Zepter-Careers images/Heart.png",
    title: "Zdrav život za sve",
    description: "Zdravlje kao apsolutni prioritet, a ne luksuz.",
  },
  {
    icon: "/Zepter-Careers images/Brain.png",
    title: "Znanja za promenu",
    description: "Kontinuirano učenje kao ključ za vizionarske ideje.",
  },
  {
    icon: "/Zepter-Careers images/World.png",
    title: "Odgovornost prema planeti",
    description: "Održiva rešenja za generacije koje dolaze.",
  },
  {
    icon: "/Zepter-Careers images/People.png",
    title: "Snaga različitosti",
    description: "Uvažavanje autentičnosti svakog pojedinca.",
  },
];

const ValuesSection = () => {
  return (
    <section className="values-section">
      <div className="values-section__inner">
        <h2 className="values-section__title">Naše vrednosti</h2>
        <p className="values-section__subtitle">
          Karijera koja počiva na najčistijim principima.
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
      </div>
    </section>
  );
};

export default ValuesSection;