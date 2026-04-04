import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import "../styles/info-pages.css";

const processSteps = [
  {
    step: "01",
    title: "Prijava",
    text: "Izaberite poziciju koja vam odgovara i pošaljite prijavu sa potrebnim dokumentima.",
  },
  {
    step: "02",
    title: "Pregled prijava",
    text: "Naš tim pregledava pristigle prijave i procenjuje usklađenost kandidata sa zahtevima pozicije.",
  },
  {
    step: "03",
    title: "Intervju",
    text: "Kandidati koji uđu u uži izbor biće kontaktirani radi dogovora o intervjuu ili narednim koracima.",
  },
  {
    step: "04",
    title: "Povratna informacija",
    text: "Nakon završenog procesa selekcije, kandidati dobijaju informaciju o statusu prijave.",
  },
];

const ProcessPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  return (
    <>
      <Header onOpenNotifications={() => setIsNotificationModalOpen(true)} />

      <section className="info-page-hero">
        <div className="info-page-hero__inner">
          <h1 className="info-page-hero__title">Process</h1>
          <p className="info-page-hero__subtitle">
            Jednostavan i pregledan proces prijave i selekcije kandidata.
          </p>
        </div>
      </section>

      <section className="info-page-section">
        <div className="info-page-section__inner">
          <div className="process-grid">
            {processSteps.map((item) => (
              <article key={item.step} className="process-card">
                <div className="process-card__step">{item.step}</div>
                <h3 className="process-card__title">{item.title}</h3>
                <p className="process-card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer onOpenNotifications={() => setIsNotificationModalOpen(true)} />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
};

export default ProcessPage;