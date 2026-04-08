import { useEffect, useMemo, useState } from "react";
import CustomSelect from "./CustomSelect";
import CountrySearchSelect from "./CountrySearchSelect";
import { getJobFilters } from "../api/jobsApi";
import type { JobFiltersResponse } from "../types/jobs";
import type { JobsFiltersState } from "../pages/JobsPage";

type JobsHeroSectionProps = {
  filters: JobsFiltersState;
  onChangeFilters: React.Dispatch<React.SetStateAction<JobsFiltersState>>;
};

const JobsHeroSection = ({ filters, onChangeFilters }: JobsHeroSectionProps) => {
  const [keywordInput, setKeywordInput] = useState(filters.search);
  const [availableFilters, setAvailableFilters] = useState<JobFiltersResponse | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  useEffect(() => {
    setKeywordInput(filters.search);
  }, [filters.search]);

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

  const regionOptions = useMemo(() => {
    const dynamic = availableFilters?.regions || [];
    return dynamic.map((item) => ({
      value: item.value,
      label: item.label,
    }));
  }, [availableFilters]);

  const locationTypeOptions = useMemo(() => {
    const dynamic = availableFilters?.locationTypes || [];
    return [
      { value: "", label: "Sve lokacije" },
      ...dynamic.map((item) => ({
        value: item.value,
        label: item.label,
      })),
    ];
  }, [availableFilters]);

  const languageOptions = useMemo(() => {
    const dynamic = availableFilters?.locales || [];
    return dynamic.length > 0
      ? dynamic
      : [
          { value: "sr", label: "Srpski" },
          { value: "en", label: "English" },
        ];
  }, [availableFilters]);

  const handleSearch = () => {
    onChangeFilters((prev) => ({
      ...prev,
      search: keywordInput.trim(),
    }));
  };

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
              <input
                type="text"
                placeholder="Pretraži otvorene pozicije"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>

            <div className="jobs-hero__divider" />

            <div className="jobs-hero__field jobs-hero__field--location">
              <img
                src="/Zepter-Careers images/VectorLoc.png"
                alt="Location"
                className="jobs-hero__location-icon"
              />

              <CustomSelect
                placeholder={isLoadingFilters ? "Učitavanje..." : "Tip lokacije"}
                value={filters.locationType}
                onChange={(value) =>
                  onChangeFilters((prev) => ({
                    ...prev,
                    locationType: value,
                  }))
                }
                className="jobs-hero__custom-select"
                options={locationTypeOptions}
              />
            </div>

            <button className="jobs-hero__search-button" type="button" onClick={handleSearch}>
              <span className="jobs-hero__search-button-icon">⌕</span>
              <span>Pretraga</span>
            </button>
          </div>

          <div className="jobs-hero__filters">
            <CountrySearchSelect
              placeholder={isLoadingFilters ? "Učitavanje..." : "Sve regije"}
              value={filters.region}
              onChange={(value) =>
                onChangeFilters((prev) => ({
                  ...prev,
                  region: value,
                }))
              }
              className="jobs-hero__small-custom-select"
              options={regionOptions}
            />

            <CustomSelect
              placeholder="Jezik"
              value={filters.locale}
              onChange={(value) =>
                onChangeFilters((prev) => ({
                  ...prev,
                  locale: value,
                }))
              }
              className="jobs-hero__small-custom-select"
              options={languageOptions}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsHeroSection;