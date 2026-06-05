type SalesConsultantSectionProps = {
  onOpen: () => void;
};

const SalesConsultantSection = ({ onOpen }: SalesConsultantSectionProps) => {
  return (
    <section className="sales-consultant">
      <div className="container">
        <div className="sales-consultant__card">
          <div className="sales-consultant__content">
            <p className="sales-consultant__kicker">Konsultanti u prodaji</p>
            <h2 className="sales-consultant__title">
              Postanite Zepter konsultant prodaje
            </h2>
            <p className="sales-consultant__text">
              Zepter je uvek u potrazi za ambicioznim saradnicima u prodaji. Kao
              konsultant prodaje možete promovisati Zepter proizvode za zdraviji
              i kvalitetniji život, razvijati sopstvenu mrežu kupaca i ostvarivati
              značajan dodatni prihod kroz prodajne rezultate, provizije i bonuse.
            </p>
          </div>

          <button
            type="button"
            className="sales-consultant__button"
            onClick={onOpen}
          >
            Prijavi se kao konsultant <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SalesConsultantSection;
