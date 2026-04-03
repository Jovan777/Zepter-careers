import { useState } from "react";
import CustomSelect from "./CustomSelect";

const HeroSection = () => {
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("all-regions");
    const [language, setLanguage] = useState("english");

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
                                <img
                                    src="/Zepter-Careers images/VectorLoc.png"
                                    alt="Location"
                                    className="hero__location-icon"
                                />

                                <CustomSelect
                                    placeholder="Lokacija"
                                    value={location}
                                    onChange={setLocation}
                                    className="hero__custom-select"
                                    options={[
                                        { value: "belgrade", label: "Beograd" },
                                        { value: "novi-sad", label: "Novi Sad" },
                                        { value: "remote", label: "Remote" },
                                    ]}
                                />
                            </div>

                            <button className="hero__search-button">
                                <span className="hero__search-button-icon">⌕</span>
                                <span>Pretraga</span>
                            </button>
                        </div>

                        <div className="hero__filters">
                            <CustomSelect
                                placeholder="All Regions"
                                value={region}
                                onChange={setRegion}
                                className="hero__small-custom-select"
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
                                className="hero__small-custom-select"
                                options={[
                                    { value: "english", label: "English" },
                                    { value: "serbian", label: "Srpski" },
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