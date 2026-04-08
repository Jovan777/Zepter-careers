import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import CountrySearchSelect from "./CountrySearchSelect";
import { getJobFilters } from "../api/jobsApi";
import type { JobFiltersResponse } from "../types/jobs";

const fallbackCountryOptions = [
  { value: "austria", label: "Austria" },
  { value: "belarus", label: "Belarus" },
  { value: "bosnia-and-herzegovina", label: "Bosnia and Herzegovina" },
  { value: "bulgaria", label: "Bulgaria" },
  { value: "croatia", label: "Croatia" },
  { value: "czech-republic", label: "Czech Republic" },
  { value: "estonia", label: "Estonia" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "hungary", label: "Hungary" },
  { value: "italy", label: "Italy" },
  { value: "latvia", label: "Latvia" },
  { value: "lithuania", label: "Lithuania" },
  { value: "moldova", label: "Moldova" },
  { value: "netherlands", label: "Netherlands" },
  { value: "norway", label: "Norway" },
  { value: "poland", label: "Poland" },
  { value: "romania", label: "Romania" },
  { value: "russia", label: "Russia" },
  { value: "serbia", label: "Serbia" },
  { value: "slovakia", label: "Slovakia" },
  { value: "slovenia", label: "Slovenia" },
  { value: "spain", label: "Spain" },
  { value: "switzerland", label: "Switzerland" },
  { value: "ukraine", label: "Ukraine" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "united-states", label: "United States" },
  { value: "australia", label: "Australia" },
  { value: "azerbaijan", label: "Azerbaijan" },
  { value: "egypt", label: "Egypt" },
  { value: "india", label: "India" },
  { value: "israel", label: "Israel" },
  { value: "jordan", label: "Jordan" },
  { value: "kazakhstan", label: "Kazakhstan" },
  { value: "new-zealand", label: "New Zealand" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [locationType, setLocationType] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("sr");
  const [availableFilters, setAvailableFilters] = useState<JobFiltersResponse | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await getJobFilters();
        setAvailableFilters(data);
      } catch (error) {
        console.error("Greška pri dohvatanju job filtera:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  const countryOptions = useMemo(() => {
    const dynamic = availableFilters?.regions || [];

    if (dynamic.length > 0) {
      return dynamic.map((item) => ({
        value: item.value,
        label: item.label,
      }));
    }

    return fallbackCountryOptions;
  }, [availableFilters]);

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
              <CountrySearchSelect
                placeholder={isLoadingFilters ? "Učitavanje..." : "Sve regije"}
                value={region}
                onChange={setRegion}
                className="hero__small-custom-select"
                options={countryOptions}
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