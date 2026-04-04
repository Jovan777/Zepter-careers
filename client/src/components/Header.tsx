import { Link } from "react-router-dom";

type HeaderProps = {
  onOpenNotifications: () => void;
};

const Header = ({ onOpenNotifications }: HeaderProps) => {
  return (
    <header className="header">
      <div className="container header__inner">
        <a
          href="https://www.zepter.rs/"
          className="header__logo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Zepter-Careers images/zepter_logo_web 1.png"
            alt="Zepter"
          />
        </a>

        <nav className="header__nav">
          <Link to="/jobs" className="header__nav-link">
            Jobs
          </Link>

          <Link to="/process" className="header__nav-link">
            Process
          </Link>

          <a
            href="https://www.zepter.rs/contacts"
            className="header__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>

          <Link to="/faq" className="header__nav-link">
            FAQ
          </Link>
        </nav>

        <div className="header__actions">
          <button className="header__alert-btn" onClick={onOpenNotifications}>
            <img
              src="/Zepter-Careers images/Bell.png"
              alt="Bell"
              className="header__alert-bell"
            />
            <span>Prijavite se za obaveštenja</span>
            <span className="header__alert-arrow">›</span>
          </button>

          <a href="https://www.zepter.rs/zepterclub" className="header__club-logo">
            <img
              src="/Zepter-Careers images/zk_kockica 2.png"
              alt="Zepter Club"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;