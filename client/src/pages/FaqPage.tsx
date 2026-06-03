import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import "../styles/info-pages.css";

const faqItems = [
  {
    question: "Kako mogu da se prijavim na otvorenu poziciju?",
    answer:
      "Na delu 'Otvorene pozicije' pronađite oglas koji Vas najviše zanime i kliknite na dugme 'Konkurišite'. Zatim popunite formu sa traženim informacijama i priložite CV.",
  },
  {
    question: "Da li mogu da se prijavim na više pozicija?",
    answer:
      "Ukoliko prepoznajete sebe u više otvorenih pozicija, možete konkursirati za svaku od njih.",
  },
  {
    question: "Koja dokumenta su obavezna prilikom prijave?",
    answer:
      "CV + Motivaciono/Propratno pismo. Možete priložiti i dodatne dokumente poput preporuka, sertifikata ili portfolija, ali nisu obavezni.",
  },
  {
    question: "Da li ću dobiti potvrdu da je prijava uspešno poslata?",
    answer:
      "Nakon uspešnog slanja prijave, na ekranu će vam biti prikazana potvrda da je prijava evidentirana.",
  },
  {
    question: "Kako funkcionišu obaveštenja o novim poslovima?",
    answer:
      "Bićete obavešteni putem email adrese kada se pojave relevantne pozicije.",
  },
  {
    question: "Niste pronašli odgovor na svoje pitanje?",
    answer: (
      <>
        Slobodno nas kontaktirajte. Naš HR tim Vam stoji na raspolaganju za sve
        dodatne informacije na{" "}
        <a href="mailto:karijera@zepter.rs">karijera@zepter.rs</a> ili popunite{" "}
        <Link to="/contact" className="faq__answer-link">
          formu za kontakt
        </Link>      </>
    ),
  },
  {
    question: "Šta je ZepterClub i zašto je važan za kandidate?",
    answer: (
      <>
        ZepterClub je naš ekosistem koji povezuje kupce, članove, partnere i
        konsultante u jedinstvenu mrežu privilegija, preporuka i poslovnih
        mogućnosti.{" "}
        <a
          href="https://www.zepter.rs/zepterclub"
          target="_blank"
          rel="noopener noreferrer"
          className="faq__answer-link"
        >
          Saznajte više o ZepterClub-u
        </a>
        .
      </>
    ),
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
          <h1 className="info-page-hero__title">Najčešće postavljana pitanja</h1>
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