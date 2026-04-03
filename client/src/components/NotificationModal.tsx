import { useState } from "react";

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [locationType, setLocationType] = useState("specific");
  const [city, setCity] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!acceptedTerms) return;

    console.log({
      email,
      keyword,
      workArea,
      locationType,
      city,
      acceptedTerms,
      marketingConsent,
    });

    onClose();
  };

  return (
    <div className="notification-modal__overlay" onClick={onClose}>
      <div
        className="notification-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notification-modal__header">
          <div className="notification-modal__title-wrap">
            <img
              src="/Zepter-Careers images/BellNews.png"
              alt="Bell"
              className="notification-modal__bell"
            />
            <h2 className="notification-modal__title">
              Prijavite se za obaveštenja
            </h2>
          </div>

          <button
            type="button"
            className="notification-modal__close"
            onClick={onClose}
            aria-label="Zatvori modal"
          >
            ×
          </button>
        </div>

        <div className="notification-modal__body">
          <div className="notification-modal__field">
            <label>Email *</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="notification-modal__field">
            <label>Ključna reč</label>
            <input
              type="text"
              placeholder="npr. menadžer, programer, analitičar..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="notification-modal__field">
            <label>Oblast rada</label>
            <div className="notification-modal__select-wrap">
              <select
                value={workArea}
                onChange={(e) => setWorkArea(e.target.value)}
              >
                <option value="" disabled>
                  Izaberite oblast rada
                </option>
                <option value="sales">Prodaja</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
                <option value="it">IT</option>
              </select>
              <span className="notification-modal__select-arrow">⌄</span>
            </div>
          </div>

          <div className="notification-modal__field">
            <label>Tip lokacije</label>

            <div className="notification-modal__radio-group">
              <label className="notification-modal__radio">
                <input
                  type="radio"
                  name="locationType"
                  value="remote"
                  checked={locationType === "remote"}
                  onChange={(e) => setLocationType(e.target.value)}
                />
                <span>Samo remote pozicije</span>
              </label>

              <label className="notification-modal__radio">
                <input
                  type="radio"
                  name="locationType"
                  value="specific"
                  checked={locationType === "specific"}
                  onChange={(e) => setLocationType(e.target.value)}
                />
                <span>Specifična lokacija</span>
              </label>

              <label className="notification-modal__radio">
                <input
                  type="radio"
                  name="locationType"
                  value="hybrid"
                  checked={locationType === "hybrid"}
                  onChange={(e) => setLocationType(e.target.value)}
                />
                <span>Hibridni model rada</span>
              </label>
            </div>
          </div>

          <div className="notification-modal__field">
            <label>Izaberite lokaciju</label>
            <div className="notification-modal__select-wrap">
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="" disabled>
                  Izaberite grad
                </option>
                <option value="beograd">Beograd</option>
                <option value="novi-sad">Novi Sad</option>
                <option value="nis">Niš</option>
              </select>
              <span className="notification-modal__select-arrow">⌄</span>
            </div>
          </div>

          <label className="notification-modal__checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              Slažem se sa <a href="#">Uslovima korišćenja</a> i potvrđujem da će
              moji podaci biti korišćeni u skladu sa{" "}
              <a href="#">Politikom privatnosti</a> *
            </span>
          </label>

          <label className="notification-modal__checkbox">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
            />
            <span>
              Želim da primam obaveštenja o Zepter proizvodima, akcijama i
              popustima.
            </span>
          </label>

          <button
            type="button"
            className="notification-modal__submit"
            disabled={!acceptedTerms}
            onClick={handleSubmit}
          >
            Pošalji prijavu
          </button>

          <p className="notification-modal__footnote">
            Možete otkazati pretplatu u bilo kom trenutku
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;