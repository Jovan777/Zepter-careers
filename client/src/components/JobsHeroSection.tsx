import { useEffect, useMemo, useState } from "react";
import CustomSelect from "./CustomSelect";
import CountrySearchSelect from "./CountrySearchSelect";
import { getJobFilters } from "../api/jobsApi";
import type { JobFiltersResponse } from "../types/jobs";
import type { JobsFiltersState } from "../pages/JobsPage";

type JobsHeroSectionProps = {
  filters: JobsFiltersState;
  onApplyFilters: (filters: JobsFiltersState) => void;
};

const JobsHeroSection = ({ filters, onApplyFilters }: JobsHeroSectionProps) => {
  const [draftFilters, setDraftFilters] = useState<JobsFiltersState>(filters);
  const [availableFilters, setAvailableFilters] = useState<JobFiltersResponse | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

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
    onApplyFilters({
      ...draftFilters,
      search: draftFilters.search.trim(),
    });
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
                value={draftFilters.search}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
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
                value={draftFilters.locationType}
                onChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    locationType: value,
                  }))
                }
                className="jobs-hero__custom-select"
                options={locationTypeOptions}
              />
            </div>

            <button
              className="jobs-hero__search-button"
              type="button"
              onClick={handleSearch}
            >
              <span className="jobs-hero__search-button-icon">⌕</span>
              <span>Pretraga</span>
            </button>
          </div>

          <div className="jobs-hero__filters">
            <CountrySearchSelect
              placeholder={isLoadingFilters ? "Učitavanje..." : "Sve regije"}
              value={draftFilters.region}
              onChange={(value) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  region: value,
                }))
              }
              className="jobs-hero__small-custom-select"
              options={regionOptions}
            />

            <CustomSelect
              placeholder="Jezik"
              value={draftFilters.locale}
              onChange={(value) =>
                setDraftFilters((prev) => ({
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