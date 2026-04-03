const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="container hero__content">
        <div className="hero__left">
          <h1 className="hero__title">ZAPOSLI SE U ZEPTER</h1>
          <p className="hero__subtitle">
            Vaš talenat. Naša vizija. Zdravija zajednička budućnost.
          </p>

          <div className="hero__search-box">
            <div className="hero__search-main">
              <div className="hero__field hero__field--keyword">
                <span className="hero__field-icon">⌕</span>
                <input
                  type="text"
                  placeholder="Pretraži otvorene pozicije"
                />
              </div>

              <div className="hero__divider" />

              <div className="hero__field hero__field--location">
                <span className="hero__field-icon">📍</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Lokacija
                  </option>
                  <option value="belgrade">Beograd</option>
                  <option value="novi-sad">Novi Sad</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <button className="hero__search-button">Pretraga</button>
            </div>

            <div className="hero__filters">
              <select className="hero__small-select" defaultValue="all-regions">
                <option value="all-regions">All Regions</option>
                <option value="serbia">Serbia</option>
                <option value="europe">Europe</option>
              </select>

              <select className="hero__small-select" defaultValue="english">
                <option value="english">English</option>
                <option value="serbian">Srpski</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <img
            src="/Zepter-Careers images/zepter_40_years 1.png"
            alt="Zepter 40 years"
            className="hero__anniversary-logo"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;