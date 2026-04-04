type FooterProps = {
  onOpenNotifications: () => void;
};

const companyLinks = [
  { label: "Blog", url: "https://www.zepter.rs/blog" },
  { label: "Misija", url: "https://www.zepter.rs/zepter-world/company-profile/#vision-mission" },
  { label: "Kontakt", url: "https://www.zepter.rs/contacts" },
  { label: "Zepter Srbija", url: "https://www.zepter.rs/zepter-world/zepter-serbia" },
  { label: "Prodavnice", url: "https://www.zepter.rs/zepter-world/zepter-prodavnice" },
];

const rulesLinks = [
  { label: "Dozvola za prodaju medicinskih proizvoda", url: "https://www.zepter.rs/rules/medical-products-sale" },
  { label: "Dokumenti", url: "https://www.zepter.rs/rules/documents" },
  { label: "Opšte odredbe internet trgovine", url: "https://www.zepter.rs/rules/regulation" },
  { label: "Uslovi dostave i načina plaćanja", url: "https://www.zepter.rs/rules/limits-of-delivery-and-manner-of-payment" },
  { label: "ZepterClub uslovi", url: "https://www.zepter.rs/rules/regulation-cl-100" },
  { label: "Politika privatnosti", url: "https://www.zepter.rs/rules/privacy-policy" },
  { label: "Uslovi čuvanja poslovne tajne", url: "https://www.zepter.rs/rules/uslovi-cuvanja-poslovne-tajne" },
];

const Footer = ({ onOpenNotifications }: FooterProps) => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="https://www.zepter.rs/">
              <img
                src="/Zepter-Careers images/zepter_logo_web 1.png"
                alt="Zepter"
                className="footer__logo"
              />
            </a>
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
              <a href="https://www.facebook.com/zepter.rs" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="footer__icon">
                  <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/zepter_srbija/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="footer__icon">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.8a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                </svg>
              </a>

              <a href="https://www.youtube.com/@ZepterSrbijaOfficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" className="footer__icon">
                  <path d="M21.8 8s-.2-1.6-.8-2.3c-.7-.9-1.6-.9-2-.9C16.2 4.5 12 4.5 12 4.5h0s-4.2 0-7 .3c-.4 0-1.3 0-2 .9C2.4 6.4 2.2 8 2.2 8S2 9.8 2 11.6v.8c0 1.8.2 3.6.2 3.6s.2 1.6.8 2.3c.7.9 1.7.9 2.2 1C7.1 19.6 12 19.6 12 19.6s4.2 0 7-.3c.4 0 1.3 0 2-.9.6-.7.8-2.3.8-2.3s.2-1.8.2-3.6v-.8c0-1.8-.2-3.6-.2-3.6zM10 15V9l5 3-5 3z" />
                </svg>
              </a>

              <a href="https://www.tiktok.com/@zeptersrbija" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" className="footer__icon">
                  <path d="M16 3c.4 2.2 2 3.8 4 4v3c-1.5 0-2.9-.5-4-1.3V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v3a2 2 0 102 2V3h2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Kompanija</h3>
            <ul className="footer__list">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column footer__column--rules">
            <h3 className="footer__heading">Pravila</h3>
            <ul className="footer__list">
              {rulesLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__cta">
            <h3 className="footer__cta-title">
              Budite u toku sa novim prilikama
            </h3>

            <button
              type="button"
              className="footer__button"
              onClick={onOpenNotifications}
            >
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