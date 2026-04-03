import { useState } from "react";
import { openPositions, type OpenPosition } from "../data/openPositions";

const JobsResultsSection = () => {
  const [selectedJob, setSelectedJob] = useState<OpenPosition | null>(openPositions[0]);

  return (
    <section className="jobs-results">
      <div className="jobs-results__inner">
        <div className="jobs-results__topbar">
          <span className="jobs-results__selection-label">Vaša selekcija</span>
          <button
            type="button"
            className="jobs-results__clear-btn"
            onClick={() => setSelectedJob(null)}
          >
            Clear all
          </button>
        </div>

        <div className="jobs-results__layout">
          <aside className="jobs-results__list">
            {openPositions.map((job) => {
              const isActive = selectedJob?.id === job.id;

              return (
                <article
                  key={job.id}
                  className={`jobs-mini-card ${isActive ? "jobs-mini-card--active" : ""}`}
                  onClick={() => setSelectedJob(job)}
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
                      {job.company}
                    </span>

                    <span className="jobs-mini-card__meta-item">
                      <img
                        src="/Zepter-Careers images/VectorLoc.png"
                        alt="Location"
                        className="jobs-mini-card__meta-icon"
                      />
                      {job.location}
                    </span>
                  </div>

                  <div className="jobs-mini-card__footer">
                    <span>{job.employmentType}</span>
                    <span>{job.publishedAt}</span>
                    <span>Applied {job.appliedCount}</span>
                  </div>
                </article>
              );
            })}
          </aside>

          <div className="jobs-results__details">
            {selectedJob ? (
              <article className="job-details-card">
                <div className="job-details-card__header">
                  <div className="job-details-card__title-wrap">
                    <img
                      src="/Zepter-Careers images/ZepterJobLogo.png"
                      alt="Zepter"
                      className="job-details-card__logo"
                    />

                    <div>
                      <h2 className="job-details-card__title">{selectedJob.title}</h2>

                      <div className="job-details-card__meta">
                        <span className="job-details-card__meta-item">
                          <img
                            src="/Zepter-Careers images/JobIcon.png"
                            alt="Company"
                            className="job-details-card__meta-icon"
                          />
                          {selectedJob.company}
                        </span>

                        <span className="job-details-card__meta-item">
                          <img
                            src="/Zepter-Careers images/VectorLoc.png"
                            alt="Location"
                            className="job-details-card__meta-icon"
                          />
                          {selectedJob.location}
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

                    <button type="button" className="job-details-card__apply-btn">
                      Konkurs za poziciju <span>›</span>
                    </button>
                  </div>
                </div>

                <div className="job-details-card__summary-row">
                  <span>{selectedJob.employmentType}</span>
                  <span>{selectedJob.publishedAt}</span>
                </div>

                <div className="job-details-card__divider" />

                <div className="job-details-card__block">
                  <h3 className="job-details-card__section-title">Kvalifikacije</h3>
                  <div className="job-details-card__tags">
                    {selectedJob.qualifications.map((tag) => (
                      <span key={tag} className="job-details-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-details-card__divider" />

                <div className="job-details-card__block">
                  {selectedJob.intro.map((paragraph, index) => (
                    <p key={index} className="job-details-card__text">
                      {paragraph}
                    </p>
                  ))}

                  <h3 className="job-details-card__section-title">Zašto ova pozicija?</h3>
                  {selectedJob.whyJoin.map((paragraph, index) => (
                    <p key={index} className="job-details-card__text">
                      {paragraph}
                    </p>
                  ))}

                  <h3 className="job-details-card__section-title">Odgovornosti</h3>
                  <ul className="job-details-card__list">
                    {selectedJob.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="job-details-card__section-title">Uslovi</h3>
                  <ul className="job-details-card__list">
                    {selectedJob.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ) : (
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
            )}
          </div>
        </div>

        <div className="jobs-results__pagination">
          <div className="jobs-results__pagination-divider" />
          <div className="jobs-results__pagination-inner">
            <div className="jobs-results__pages">
              <button className="jobs-results__page jobs-results__page--active">1</button>
              <button className="jobs-results__page">2</button>
            </div>

            <button className="jobs-results__next">
              Next <span>›</span>
            </button>
          </div>
          <div className="jobs-results__pagination-divider" />
        </div>
      </div>
    </section>
  );
};

export default JobsResultsSection;