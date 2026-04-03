import { openPositions } from "../data/openPositions";

const OpenPositionsSection = () => {
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

            <a href="#jobs" className="open-positions__link">
              Pretraži sve <span>›</span>
            </a>
          </div>

          <div className="open-positions__grid">
            {openPositions.map((position) => (
              <article key={position.id} className="job-card">
                <button
                  className="job-card__favorite"
                  type="button"
                  aria-label="Sačuvaj poziciju"
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
                    {position.company}
                  </span>

                  <span className="job-card__meta-item">
                    <img
                      src="/Zepter-Careers images/VectorLoc.png"
                      alt="Location"
                      className="job-card__meta-img"
                    />
                    {position.location}
                  </span>

                  <span className="job-card__date-pill">{position.publishedAt}</span>
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