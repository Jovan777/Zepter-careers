import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApplyJobModal from "./ApplyJobModal";
import { getJobById, getPublishedJobs } from "../api/jobsApi";
import type { JobDetailsResponse, JobListItem } from "../types/jobs";
import type { JobsFiltersState } from "../pages/JobsPage";

type JobsResultsSectionProps = {
  filters: JobsFiltersState;
};

const JobsResultsSection = ({ filters }: JobsResultsSectionProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<JobDetailsResponse | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const openApplyModal = () => setIsApplyModalOpen(true);
  const closeApplyModal = () => setIsApplyModalOpen(false);

  const requestedJobId = searchParams.get("job");

  const updateSearchParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    updateSearchParam("job", jobId);
  };

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.region, filters.locationType, filters.locale, filters.workArea, filters.employmentType]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoadingJobs(true);
        setJobsError("");

        const data = await getPublishedJobs({
          locale: filters.locale,
          search: filters.search,
          region: filters.region,
          locationType: filters.locationType,
          workArea: filters.workArea,
          employmentType: filters.employmentType,
          page,
          limit: 10,
        });

        setJobs(data.items);
        setPagination(data.pagination);

        if (data.items.length > 0) {
          const requestedExists = requestedJobId
            ? data.items.some((item) => item.publicId === requestedJobId)
            : false;

          const currentExists = selectedJobId
            ? data.items.some((item) => item.publicId === selectedJobId)
            : false;

          const nextSelectedJobId = requestedExists
            ? requestedJobId
            : currentExists
              ? selectedJobId
              : data.items[0].publicId;

          setSelectedJobId(nextSelectedJobId || null);

          if (nextSelectedJobId && requestedJobId !== nextSelectedJobId) {
            updateSearchParam("job", nextSelectedJobId);
          }
        } else {
          setSelectedJobId(null);
          setSelectedJobDetails(null);
          updateSearchParam("job", "");
        }
      } catch (error) {
        console.error(error);
        setJobsError("Greška pri dohvatanju poslova.");
        setJobs([]);
        setSelectedJobId(null);
        setSelectedJobDetails(null);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadJobs();
  }, [
    filters.locale,
    filters.search,
    filters.region,
    filters.locationType,
    filters.workArea,
    filters.employmentType,
    page,
    requestedJobId,
  ]);

  useEffect(() => {
    if (!selectedJobId) {
      setSelectedJobDetails(null);
      return;
    }

    const loadJobDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setDetailsError("");

        const data = await getJobById(selectedJobId, filters.locale);
        setSelectedJobDetails(data);
      } catch (error) {
        console.error(error);
        setDetailsError("Greška pri dohvatanju detalja posla.");
        setSelectedJobDetails(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadJobDetails();
  }, [selectedJobId, filters.locale]);

  const isSwitchingDetails = isLoadingDetails && !!selectedJobDetails;

  return (
    <section className="jobs-results">
      <div className="jobs-results__inner">
        <div className="jobs-results__topbar">
          <span className="jobs-results__selection-label">Vaša selekcija</span>
          <button
            type="button"
            className="jobs-results__clear-btn"
            onClick={() => {
              setSelectedJobId(null);
              setSelectedJobDetails(null);
              updateSearchParam("job", "");
            }}
          >
            Clear all
          </button>
        </div>

        <div className="jobs-results__layout">
          <aside className="jobs-results__list">
            {isLoadingJobs && <p>Učitavanje poslova...</p>}
            {jobsError && <p>{jobsError}</p>}

            {!isLoadingJobs &&
              !jobsError &&
              jobs.map((job) => {
                const isActive = selectedJobId === job.publicId;

                return (
                  <article
                    key={job.publicId}
                    className={`jobs-mini-card ${isActive ? "jobs-mini-card--active" : ""}`}
                    onClick={() => handleSelectJob(job.publicId)}
                  >
                    <button
                      type="button"
                      className="jobs-mini-card__favorite"
                      aria-label="Sačuvaj poziciju"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ♡
                    </button>

                    <h3 className="jobs-mini-card__title">{job.title}</h3>

                    <div className="jobs-mini-card__meta">
                      <span className="jobs-mini-card__meta-item">
                        <img
                          src="/Zepter-Careers images/JobIcon.png"
                          alt="Company"
                          className="jobs-mini-card__meta-icon"
                        />
                        {job.company.name}
                      </span>

                      <span className="jobs-mini-card__meta-item">
                        <img
                          src="/Zepter-Careers images/VectorLoc.png"
                          alt="Location"
                          className="jobs-mini-card__meta-icon"
                        />
                        {job.location.label}
                      </span>
                    </div>

                    <div className="jobs-mini-card__footer">
                      <span>{job.employmentTypeLabel || "-"}</span>
                      <span>{new Date(job.postedAt).toLocaleDateString("sr-RS")}</span>
                      <span>Applied {job.appliedCount}</span>
                    </div>
                  </article>
                );
              })}
          </aside>

          <div className={`jobs-results__details ${isSwitchingDetails ? "jobs-results__details--loading" : ""}`}>
            {detailsError && <p>{detailsError}</p>}

            {!detailsError && selectedJobDetails ? (
              <article key={selectedJobDetails.publicId}
                className="job-details-card">
                <div className="job-details-card__header">
                  <div className="job-details-card__title-wrap">
                    <img
                      src="/Zepter-Careers images/ZepterJobLogo.png"
                      alt="Zepter"
                      className="job-details-card__logo"
                    />

                    <div>
                      <h2 className="job-details-card__title">
                        {selectedJobDetails.translation.title}
                      </h2>

                      <div className="job-details-card__meta">
                        <span className="job-details-card__meta-item">
                          <img
                            src="/Zepter-Careers images/JobIcon.png"
                            alt="Company"
                            className="job-details-card__meta-icon"
                          />
                          {selectedJobDetails.company.name}
                        </span>

                        <span className="job-details-card__meta-item">
                          <img
                            src="/Zepter-Careers images/VectorLoc.png"
                            alt="Location"
                            className="job-details-card__meta-icon"
                          />
                          {selectedJobDetails.location.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="job-details-card__actions">
                    <button
                      type="button"
                      className="job-details-card__favorite"
                      aria-label="Sačuvaj poziciju"
                    >
                      ♡
                    </button>

                    <button
                      type="button"
                      className="job-details-card__apply-btn"
                      onClick={openApplyModal}
                    >
                      {selectedJobDetails.translation.applyLabel || "Konkurs za poziciju"}{" "}
                      <span>›</span>
                    </button>
                  </div>
                </div>

                <div className="job-details-card__summary-row">
                  <span>{selectedJobDetails.employmentTypeLabel || "-"}</span>
                  <span>
                    {new Date(selectedJobDetails.postedAt).toLocaleDateString("sr-RS")}
                  </span>
                </div>

                <div className="job-details-card__divider" />

                <div className="job-details-card__block">
                  <h3 className="job-details-card__section-title">Kvalifikacije</h3>
                  <div className="job-details-card__tags">
                    {selectedJobDetails.translation.qualifications.map((tag) => (
                      <span key={tag} className="job-details-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-details-card__divider" />

                <div className="job-details-card__block">
                  {selectedJobDetails.translation.intro.map((paragraph, index) => (
                    <p key={index} className="job-details-card__text">
                      {paragraph}
                    </p>
                  ))}

                  <h3 className="job-details-card__section-title">Zašto ova pozicija?</h3>
                  <p className="job-details-card__text">
                    {selectedJobDetails.translation.whyThisPosition}
                  </p>

                  <h3 className="job-details-card__section-title">O Zepteru</h3>
                  <p className="job-details-card__text">
                    {selectedJobDetails.translation.aboutZepter}
                  </p>

                  <h3 className="job-details-card__section-title">Odgovornosti</h3>
                  <ul className="job-details-card__list">
                    {selectedJobDetails.translation.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="job-details-card__section-title">Uslovi</h3>
                  <ul className="job-details-card__list">
                    {selectedJobDetails.translation.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ) : (
              !detailsError &&
              !isLoadingDetails && (
                <div className="job-details-empty">
                  <img
                    src="/Zepter-Careers images/ZepterJobLogo.png"
                    alt="Zepter"
                    className="job-details-empty__logo"
                  />
                  <h3 className="job-details-empty__title">Izaberite poziciju</h3>
                  <p className="job-details-empty__text">
                    Sa leve strane možete odabrati otvorenu poziciju i ovde pregledati
                    njen detaljan opis, kvalifikacije i uslove.
                  </p>
                </div>
              )
            )}

            {isSwitchingDetails && (
              <div className="jobs-results__details-overlay">
                <div className="jobs-results__details-veil" />
              </div>
            )}
          </div>
        </div>

        <div className="jobs-results__pagination">
          <div className="jobs-results__pagination-divider" />
          <div className="jobs-results__pagination-inner">
            <div className="jobs-results__pages">
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`jobs-results__page ${pageNumber === pagination.page ? "jobs-results__page--active" : ""
                      }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              className="jobs-results__next"
              onClick={() => {
                if (pagination.page < pagination.totalPages) {
                  setPage((prev) => prev + 1);
                }
              }}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next <span>›</span>
            </button>
          </div>
          <div className="jobs-results__pagination-divider" />
        </div>
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
        jobTitle={selectedJobDetails?.translation.title || ""}
        jobPublicId={selectedJobDetails?.publicId || ""}
      />
    </section>
  );
};

export default JobsResultsSection;