import { useState } from "react";
import { subscribeToJobAlerts } from "../api/jobAlertsApi";
import CustomSelect from "./CustomSelect";

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const workAreaOptions = [
  { value: "sales", label: "Prodaja" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
  { value: "it", label: "IT" },
];

const cityOptions = [
  { value: "beograd", label: "Beograd" },
  { value: "novi-sad", label: "Novi Sad" },
  { value: "nis", label: "Niš" },
];

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [locationType, setLocationType] = useState("specific");
  const [city, setCity] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetForm = () => {
    setEmail("");
    setKeyword("");
    setWorkArea("");
    setLocationType("specific");
    setCity("");
    setAcceptedTerms(false);
    setMarketingConsent(false);
    setSubmitError("");
  };

  const isEmailValid = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const getValidationError = () => {
    if (!email.trim()) return "Email je obavezan.";
    if (!isEmailValid(email)) return "Unesite ispravnu email adresu.";
    if (locationType !== "remote" && !city.trim()) {
      return "Izaberite lokaciju.";
    }
    if (!acceptedTerms) {
      return "Morate prihvatiti uslove korišćenja i politiku privatnosti.";
    }
    return "";
  };

  const validationError = getValidationError();
  const isFormValid = validationError === "";

  const handleSubmit = async () => {
    if (!isFormValid) {
      setSubmitError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await subscribeToJobAlerts({
        email: email.trim(),
        keyword: keyword.trim(),
        locale: "sr",
        workArea,
        locationType,
        city: locationType === "remote" ? "" : city,
        acceptedTerms,
        marketingConsent,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error ? error.message : "Greška pri slanju prijave."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-modal__overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitError) setSubmitError("");
              }}
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
            <CustomSelect
              placeholder="Izaberite oblast rada"
              value={workArea}
              onChange={(value) => {
                setWorkArea(value);
                if (submitError) setSubmitError("");
              }}
              className="notification-modal__custom-select"
              options={workAreaOptions}
            />
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
                  onChange={(e) => {
                    setLocationType(e.target.value);
                    setCity("");
                    if (submitError) setSubmitError("");
                  }}
                />
                <span>Samo remote pozicije</span>
              </label>

              <label className="notification-modal__radio">
                <input
                  type="radio"
                  name="locationType"
                  value="specific"
                  checked={locationType === "specific"}
                  onChange={(e) => {
                    setLocationType(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                />
                <span>Specifična lokacija</span>
              </label>

              <label className="notification-modal__radio">
                <input
                  type="radio"
                  name="locationType"
                  value="hybrid"
                  checked={locationType === "hybrid"}
                  onChange={(e) => {
                    setLocationType(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                />
                <span>Hibridni model rada</span>
              </label>
            </div>
          </div>

          <div className="notification-modal__field">
            <label>
              Izaberite lokaciju {locationType !== "remote" ? "*" : ""}
            </label>

            <div
              className={
                locationType === "remote"
                  ? "notification-modal__select-disabled"
                  : ""
              }
            >
              <CustomSelect
                placeholder="Izaberite grad"
                value={city}
                onChange={(value) => {
                  setCity(value);
                  if (submitError) setSubmitError("");
                }}
                className="notification-modal__custom-select"
                options={cityOptions}
                disabled={locationType === "remote"}
              />
            </div>
          </div>

          <label className="notification-modal__checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (submitError) setSubmitError("");
              }}
            />
            <span>
              Slažem se sa{" "}
              <a
                href="https://www.zepter.rs/rules/regulation"
                target="_blank"
                rel="noopener noreferrer"
              >
                Uslovima korišćenja
              </a>
              ,{" "}
              <a
                href="https://www.zepter.rs/rules/limits-of-delivery-and-manner-of-payment"
                target="_blank"
                rel="noopener noreferrer"
              >
                uslovima dostave i načina plaćanja
              </a>{" "}
              i potvrđujem da će moji podaci biti korišćeni u skladu sa{" "}
              <a
                href="https://www.zepter.rs/rules/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Politikom privatnosti
              </a>{" "}
              i{" "}
              <a
                href="https://www.zepter.rs/rules/uslovi-cuvanja-poslovne-tajne"
                target="_blank"
                rel="noopener noreferrer"
              >
                pravilima čuvanja poslovne tajne
              </a>
              . *
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

          {submitError && <p className="notification-modal__error">{submitError}</p>}

          <button
            type="button"
            className="notification-modal__submit"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Slanje..." : "Pošalji prijavu"}
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