const companyLinks = [
  "Blog",
  "Misija",
  "Kontakt",
  "Zepter Srbija",
  "Prodavnice",
];

const rulesLinks = [
  "Dozvola za prodaju medicinskih proizvoda",
  "Dokumenti",
  "Opšte odredbe internet trgovine",
  "Uslovi dostave i načina plaćanja",
  "ZepterClub uslovi",
  "Politika privatnosti",
  "Uslovi čuvanja poslovne tajne",
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src="/Zepter-Careers images/zepter_logo_web 1.png"
              alt="Zepter"
              className="footer__logo"
            />

            <div className="footer__contact">
              <p>Bulevar Mihajla Pupina 117, Beograd 11070</p>
              <p>Call Centar: 0800 234567</p>
              <p>Tel: 011/311-3233</p>
              <p>
                Korisnički servis:{" "}
                <a href="mailto:customersupport@zepter.rs">
                  customersupport@zepter.rs
                </a>
              </p>
            </div>

            <div className="footer__socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Pinterest">p</a>
              <a href="#" aria-label="TikTok">♪</a>
            </div>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Kompanija</h3>
            <ul className="footer__list">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column footer__column--rules">
            <h3 className="footer__heading">Pravila</h3>
            <ul className="footer__list">
              {rulesLinks.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__cta">
            <h3 className="footer__cta-title">
              Budite u toku sa novim prilikama
            </h3>

            <button type="button" className="footer__button">
              <span>Prijavite se za obaveštenja</span>
              <span className="footer__button-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 Zepter International. All Rights Reserved
          </p>

          <button type="button" className="footer__language">
            English <span>⌄</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;