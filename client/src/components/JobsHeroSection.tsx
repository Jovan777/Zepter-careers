const JobsHeroSection = () => {
  return (
    <section className="jobs-hero">
      <div className="jobs-hero__inner">
        <h1 className="jobs-hero__title">Otvorene pozicije</h1>
        <p className="jobs-hero__subtitle">
          Postanite deo našeg tima – otvorene pozicije vas čekaju
        </p>

        <div className="jobs-hero__search-box">
          <div className="jobs-hero__search-main">
            <div className="jobs-hero__field jobs-hero__field--keyword">
              <span className="jobs-hero__field-icon">⌕</span>
              <input type="text" placeholder="Pretraži otvorene pozicije" />
            </div>

            <div className="jobs-hero__divider" />

            <div className="jobs-hero__field jobs-hero__field--location">
              <img
                src="/Zepter-Careers images/VectorLoc.png"
                alt="Location"
                className="jobs-hero__location-icon"
              />
              <select defaultValue="">
                <option value="" disabled>
                  Lokacija
                </option>
                <option value="beograd">Beograd</option>
                <option value="novi-sad">Novi Sad</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <button className="jobs-hero__search-button" type="button">
              <span className="jobs-hero__search-button-icon">⌕</span>
              <span>Pretraga</span>
            </button>
          </div>

          <div className="jobs-hero__filters">
            <div className="jobs-hero__small-select-wrap">
              <select className="jobs-hero__small-select" defaultValue="all-regions">
                <option value="all-regions">All Regions</option>
                <option value="serbia">Serbia</option>
                <option value="europe">Europe</option>
              </select>
              <span className="jobs-hero__small-select-arrow">▾</span>
            </div>

            <div className="jobs-hero__small-select-wrap">
              <select className="jobs-hero__small-select" defaultValue="english">
                <option value="english">English</option>
                <option value="serbian">Srpski</option>
              </select>
              <span className="jobs-hero__small-select-arrow">▾</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsHeroSection;