import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";

const HeroSection = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [locationType, setLocationType] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("sr");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    }

    if (locationType) {
      params.set("locationType", locationType);
    }

    if (region) {
      params.set("region", region);
    }

    if (language) {
      params.set("locale", language);
    }

    navigate(`/jobs?${params.toString()}`);
  };

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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>

              <div className="hero__divider" />

              <div className="hero__field hero__field--location">
                <img
                  src="/Zepter-Careers images/VectorLoc.png"
                  alt="Location"
                  className="hero__location-icon"
                />

                <CustomSelect
                  placeholder="Tip lokacije"
                  value={locationType}
                  onChange={setLocationType}
                  className="hero__custom-select"
                  options={[
                    { value: "onsite", label: "On-site" },
                    { value: "remote", label: "Remote" },
                    { value: "hybrid", label: "Hybrid" },
                  ]}
                />
              </div>

              <button
                className="hero__search-button"
                type="button"
                onClick={handleSearch}
              >
                <span className="hero__search-button-icon">⌕</span>
                <span>Pretraga</span>
              </button>
            </div>

            <div className="hero__filters">
              <CustomSelect
                placeholder="Sve regije"
                value={region}
                onChange={setRegion}
                className="hero__small-custom-select"
                options={[
                  { value: "serbia", label: "Srbija" },
                  { value: "europe", label: "Evropa" },
                ]}
              />

              <CustomSelect
                placeholder="Jezik"
                value={language}
                onChange={setLanguage}
                className="hero__small-custom-select"
                options={[
                  { value: "sr", label: "Srpski" },
                  { value: "en", label: "English" },
                ]}
              />
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