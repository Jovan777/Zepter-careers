import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPublishedJobs } from "../api/jobsApi";
import type { JobListItem } from "../types/jobs";

const OpenPositionsSection = () => {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getPublishedJobs({
          locale: "sr",
          page: 1,
          limit: 3,
        });

        setJobs(data.items);
      } catch (error) {
        console.error("Greška pri dohvatanju otvorenih pozicija:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const openJobOnJobsPage = (jobPublicId: string) => {
    const params = new URLSearchParams();
    params.set("locale", "sr");
    params.set("job", jobPublicId);

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="open-positions">
      <div className="container">
        <div className="open-positions__wrapper">
          <div className="open-positions__header">
            <div>
              <h2 className="open-positions__title">Otvorene Pozicije</h2>
              <p className="open-positions__subtitle">
                Pridruži se našem timu — pogledaj slobodna mesta i pošalji prijavu.
              </p>
            </div>

            <Link to="/jobs" className="open-positions__link">
              Pretraži sve <span>›</span>
            </Link>
          </div>

          <div className="open-positions__grid">
            {isLoading && <p>Učitavanje...</p>}

            {!isLoading &&
              jobs.map((position) => (
                <article
                  key={position.publicId}
                  className="job-card"
                  onClick={() => openJobOnJobsPage(position.publicId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openJobOnJobsPage(position.publicId);
                    }
                  }}
                >
                  <button
                    className="job-card__favorite"
                    type="button"
                    aria-label="Sačuvaj poziciju"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ♡
                  </button>

                  <h3 className="job-card__title">{position.title}</h3>

                  <div className="job-card__meta">
                    <span className="job-card__meta-item">
                      <img
                        src="/Zepter-Careers images/JobIcon.png"
                        alt="Company"
                        className="job-card__meta-img"
                      />
                      {position.company.name}
                    </span>

                    <span className="job-card__meta-item">
                      <img
                        src="/Zepter-Careers images/VectorLoc.png"
                        alt="Location"
                        className="job-card__meta-img"
                      />
                      {position.location.label}
                    </span>

                    <span className="job-card__date-pill">
                      {new Date(position.postedAt).toLocaleDateString("sr-RS")}
                    </span>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenPositionsSection;