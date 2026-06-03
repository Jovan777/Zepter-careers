type TalentPoolSectionProps = {
  onOpen: () => void;
};

const TalentPoolSection = ({ onOpen }: TalentPoolSectionProps) => {
  return (
    <section className="talent-pool-section">
      <div className="container">
        <div className="talent-pool-section__card">
          <div className="talent-pool-section__content">
            <p className="talent-pool-section__eyebrow">Otvorena prijava</p>
            <h2 className="talent-pool-section__title">
              Ne vidite poziciju koja vam trenutno odgovara?
            </h2>
            <p className="talent-pool-section__text">
              Ukoliko se ne pronalazite ni u jednoj od trenutno otvorenih pozicija,
              a želite da budete deo Zepter sveta, pošaljite nam svoje podatke i
              CV. Naš HR tim će razmotriti vašu prijavu i kontaktirati vas kada
              se pojavi odgovarajuća prilika.
            </p>
          </div>

          <button
            type="button"
            className="talent-pool-section__button"
            onClick={onOpen}
          >
            Pošalji otvorenu prijavu <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TalentPoolSection;
