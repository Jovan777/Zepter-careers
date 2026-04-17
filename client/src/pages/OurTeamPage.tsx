import { useState } from "react";
import OfficialHeader from "../components/OfficialHeader";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import "../styles/our-team.css";

const boardMembers = [
  {
    name: "Milan Petrović",
    role: "Chief Executive Officer (CEO)",
    image: "/Zepter BoardMembers/zepter-board-members-ceo.jpg",
    bio: "Milan Petrović vodi kompaniju sa fokusom na strateški razvoj, inovacije i dugoročno jačanje pozicije Zeptera na međunarodnom tržištu. Njegovo iskustvo u upravljanju timovima i poslovnim transformacijama doprinosi stabilnom rastu i kontinuiranom unapređenju poslovanja.",
  },
  {
    name: "Stefan Jovanović",
    role: "Chief Commercial Officer (CCO)",
    image: "/Zepter BoardMembers/zepter-board-members-cco.jpg",
    bio: "Stefan Jovanović odgovoran je za komercijalnu strategiju, razvoj prodaje i širenje tržišta. Kroz snažnu orijentaciju ka rezultatima i razumevanje potreba kupaca, aktivno doprinosi rastu prihoda i jačanju odnosa sa partnerima.",
  },
  {
    name: "Jelena Marković",
    role: "Chief Financial Officer (CFO)",
    image: "/Zepter BoardMembers/zepter-board-members-cfo.jpg",
    bio: "Jelena Marković upravlja finansijskim planiranjem, budžetiranjem i kontrolom poslovanja. Njena posvećenost transparentnosti i odgovornom upravljanju resursima obezbeđuje finansijsku stabilnost i podršku strateškim ciljevima kompanije.",
  },
  {
    name: "Marija Nikolić",
    role: "Chief Legal & Regulatory Officer (CLRO)",
    image: "/Zepter BoardMembers/zepter-board-members-clro.jpg",
    bio: "Marija Nikolić vodi pravne i regulatorne procese unutar kompanije, osiguravajući usklađenost poslovanja sa zakonima i internim politikama. Njeno iskustvo doprinosi sigurnom poslovnom okruženju i zaštiti interesa kompanije.",
  },
  {
    name: "Aleksandar Savić",
    role: "Chief People Officer (CPO)",
    image: "/Zepter BoardMembers/zepter-board-members-cpo.jpg",
    bio: "Aleksandar Savić odgovoran je za strategiju upravljanja ljudskim resursima, razvoj talenata i organizacionu kulturu. Njegov fokus je na stvaranju inspirativnog radnog okruženja i jačanju angažovanosti zaposlenih.",
  },
  {
    name: "Ivana Lazić",
    role: "Chief Administrative Officer (CAO)",
    image: "/Zepter BoardMembers/zepter-board-members-cao.jpg",
    bio: "Ivana Lazić koordinira administrativne i operativne procese koji omogućavaju efikasno funkcionisanje kompanije. Svojim radom doprinosi organizacionoj stabilnosti i podržava svakodnevne aktivnosti različitih sektora.",
  },
  {
    name: "Marko Ilić",
    role: "Chief Production & Operations Officer (CPOO)",
    image: "/Zepter BoardMembers/zepter-board-members-cpoo.jpg",
    bio: "Marko Ilić vodi procese proizvodnje i operacija sa ciljem unapređenja kvaliteta, efikasnosti i održivosti. Njegova stručnost u upravljanju procesima i resursima doprinosi ostvarivanju visokih standarda u poslovanju.",
  },
  {
    name: "Ana Radić",
    role: "Director of International Business",
    image: "/Zepter BoardMembers/zepter-board-members-interantional-bussines.jpg",
    bio: "Ana Radić razvija međunarodne poslovne prilike i uspostavlja saradnju sa partnerima na stranim tržištima. Njeno iskustvo u međunarodnom poslovanju doprinosi širenju prisustva kompanije i izgradnji globalne mreže.",
  },
  {
    name: "Nikola Stanković",
    role: "Director of Regional Business",
    image: "/Zepter BoardMembers/zepter-board-members-regionall-bussines.jpg",
    bio: "Nikola Stanković zadužen je za regionalno poslovanje i koordinaciju tržišnih aktivnosti u različitim zemljama regiona. Fokusiran je na razvoj lokalnih timova, jačanje prisustva brenda i ostvarivanje održivog rasta.",
  },
];

const OurTeamPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  return (
    <>
      <OfficialHeader />

      <section className="our-team-hero">
        <div className="our-team-hero__overlay" />
        <img
          src="/Zepter BoardMembers/board-members-wallpaper.png"
          alt="Zepter Board Members"
          className="our-team-hero__image"
        />

        <div className="our-team-hero__content">
          <p className="our-team-hero__eyebrow">Zepter International</p>
          <h1 className="our-team-hero__title">Naš Tim</h1>
          <p className="our-team-hero__subtitle">
            Upoznajte članove tima koji kroz znanje, iskustvo i viziju
            usmeravaju razvoj kompanije.
          </p>
        </div>
      </section>

      <section className="our-team-section">
        <div className="our-team-section__inner">
          <div className="our-team-section__header">
            <h2 className="our-team-section__title">Članovi našeg veća</h2>
            <p className="our-team-section__subtitle">
              Iskusni lideri koji oblikuju pravac razvoja i dugoročni uspeh kompanije.
            </p>
          </div>

          <div className="our-team-grid">
            {boardMembers.map((member) => (
              <article key={member.name} className="board-card">
                <div className="board-card__image-wrap">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="board-card__image"
                  />
                </div>

                <div className="board-card__content">
                  <h3 className="board-card__name">{member.name}</h3>
                  <p className="board-card__role">{member.role}</p>
                  <p className="board-card__bio">{member.bio}</p>
                </div>
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

export default OurTeamPage;