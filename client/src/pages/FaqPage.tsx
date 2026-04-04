import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import "../styles/info-pages.css";

const faqItems = [
  {
    question: "Kako mogu da se prijavim na otvorenu poziciju?",
    answer:
      "Na stranici Jobs izaberite poziciju koja vas interesuje, otvorite detalje oglasa i kliknite na dugme za prijavu. Zatim popunite formu i pošaljite potrebnu dokumentaciju.",
  },
  {
    question: "Da li mogu da se prijavim na više pozicija?",
    answer:
      "Da. Možete poslati prijavu za više različitih pozicija ukoliko smatrate da odgovarate uslovima konkursa.",
  },
  {
    question: "Koja dokumenta su obavezna prilikom prijave?",
    answer:
      "Obavezno je dostaviti CV. Po potrebi možete dodati i dodatna dokumenta poput sertifikata, diploma ili portfolija.",
  },
  {
    question: "Da li ću dobiti potvrdu da je prijava uspešno poslata?",
    answer:
      "Nakon uspešnog slanja prijave, na ekranu će vam biti prikazana potvrda da je prijava evidentirana.",
  },
  {
    question: "Kako funkcionišu obaveštenja o novim poslovima?",
    answer:
      "Možete se prijaviti za obaveštenja unosom email adrese, ključne reči, oblasti rada i željene lokacije. Kada se pojave relevantne pozicije, bićete obavešteni.",
  },
];

const FaqPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Header onOpenNotifications={() => setIsNotificationModalOpen(true)} />

      <section className="info-page-hero">
        <div className="info-page-hero__inner">
          <h1 className="info-page-hero__title">FAQ</h1>
          <p className="info-page-hero__subtitle">
            Odgovori na najčešća pitanja o prijavi, konkursima i obaveštenjima.
          </p>
        </div>
      </section>

      <section className="info-page-section">
        <div className="info-page-section__inner">
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <article key={item.question} className="faq-card">
                  <button
                    type="button"
                    className="faq-card__trigger"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faq-card__icon ${isOpen ? "faq-card__icon--open" : ""}`}>
                      ⌄
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-card__content">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </article>
              );
            })}
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

export default FaqPage;