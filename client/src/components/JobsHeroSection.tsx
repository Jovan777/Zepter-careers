import { useState } from "react";
import CustomSelect from "./CustomSelect";

const JobsHeroSection = () => {
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("all-regions");
  const [language, setLanguage] = useState("english");

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

              <CustomSelect
                placeholder="Lokacija"
                value={location}
                onChange={setLocation}
                className="jobs-hero__custom-select"
                options={[
                  { value: "beograd", label: "Beograd" },
                  { value: "novi-sad", label: "Novi Sad" },
                  { value: "remote", label: "Remote" },
                ]}
              />
            </div>

            <button className="jobs-hero__search-button" type="button">
              <span className="jobs-hero__search-button-icon">⌕</span>
              <span>Pretraga</span>
            </button>
          </div>

          <div className="jobs-hero__filters">
            <CustomSelect
              placeholder="All Regions"
              value={region}
              onChange={setRegion}
              className="jobs-hero__small-custom-select"
              options={[
                { value: "all-regions", label: "All Regions" },
                { value: "serbia", label: "Serbia" },
                { value: "europe", label: "Europe" },
              ]}
            />

            <CustomSelect
              placeholder="English"
              value={language}
              onChange={setLanguage}
              className="jobs-hero__small-custom-select"
              options={[
                { value: "english", label: "English" },
                { value: "serbian", label: "Srpski" },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsHeroSection;