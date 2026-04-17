import { Link } from "react-router-dom";

const OfficialHeader = () => {
  return (
    <header className="official-header">
      <div className="official-header__inner">
        <a
          href="https://www.zepter.rs/"
          className="official-header__logo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Zepter-Careers images/zepter_logo_web 1.png"
            alt="Zepter"
          />
        </a>

        <nav className="official-header__nav">
          <a
            href="https://www.zepter.rs/"
            className="official-header__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zepter
          </a>

          <Link to="/our-team" className="official-header__nav-link official-header__nav-link--active">
            Naš Tim
          </Link>

          <a
            href="https://www.zepter.rs/zepter-world/company-profile"
            className="official-header__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            O kompaniji
          </a>

          <a
            href="https://www.zepter.rs/contacts"
            className="official-header__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kontakt
          </a>
        </nav>

        <a
          href="https://www.zepter.rs/zepterclub"
          className="official-header__club-logo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Zepter-Careers images/zk_kockica 2.png"
            alt="Zepter Club"
          />
        </a>
      </div>
    </header>
  );
};

export default OfficialHeader;