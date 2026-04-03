const SolutionSection = () => {
  return (
    <section className="solution-section">
      <div className="solution-section__inner">
        <div className="solution-section__content">
          <h2 className="solution-section__title">
            Budite deo rešenja
            <br />
            koja menjaju svet
          </h2>

          <p className="solution-section__text">
            <strong>Vaš put počinje ovde.</strong> Naš uspeh definišu ljudi koji
            u inovaciji vide jedini pravi alat za promenu svakodnevice. Naš
            uspeh merimo brojem života koje smo unapredili. Verujemo da vrhunski
            poslovni rezultati dolaze prirodno, kao potvrda naše stručnosti i
            posvećenosti da edukujemo ljude i ponudimo im rešenja koja su im
            zaista potrebna.
          </p>

          <p className="solution-section__text solution-section__text--strong">
            Rekli bismo – ne čekajte priliku, već je sami stvorite. Međutim, ona
            je u Zepteru za vas već stvorena.
          </p>
        </div>

        <div className="solution-section__image-wrap">
          <img
            src="/Zepter-Careers images/worldChange.png"
            alt="Budite deo rešenja koja menjaju svet"
            className="solution-section__image"
          />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;