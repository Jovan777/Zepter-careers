import { useMemo, useState } from "react";
import { submitSalesConsultantApplication } from "../api/salesConsultantApi";

type SalesConsultantModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const countryOptions = [
  { value: "serbia", label: "Srbija" },
  { value: "bosnia", label: "Bosna i Hercegovina" },
  { value: "croatia", label: "Hrvatska" },
  { value: "montenegro", label: "Crna Gora" },
];

const isEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isSupportedCvFile = (file: File | null) => {
  if (!file) return true;
  return /\.(pdf|doc|docx)$/i.test(file.name);
};

const SalesConsultantModal = ({ isOpen, onClose }: SalesConsultantModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validationError = useMemo(() => {
    if (!firstName.trim()) return "Ime je obavezno.";
    if (!lastName.trim()) return "Prezime je obavezno.";
    if (!email.trim()) return "Email je obavezan.";
    if (!isEmailValid(email)) return "Unesite ispravnu email adresu.";
    if (!phone.trim()) return "Broj telefona je obavezan.";
    if (!country) return "Izaberite državu.";
    if (!isSupportedCvFile(cvFile)) return "CV mora biti PDF, DOC ili DOCX fajl.";
    if (!acceptedTerms) {
      return "Morate prihvatiti uslove korišćenja i politiku privatnosti.";
    }
    return "";
  }, [acceptedTerms, country, cvFile, email, firstName, lastName, phone]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCountry("");
    setCity("");
    setMessage("");
    setCvFile(null);
    setAcceptedTerms(false);
    setSubmitError("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSuccessMessage("");
    setSubmitError("");
    onClose();
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCvFile(file);
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await submitSalesConsultantApplication({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        city: city.trim(),
        message: message.trim(),
        acceptedTerms,
        marketingConsent,
        cv: cvFile,
      });

      setSuccessMessage(
        response.message ||
          "Vaša prijava za konsultanta prodaje je uspešno poslata. Naš tim će vas kontaktirati u najkraćem roku."
      );
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Greška pri slanju prijave za konsultanta prodaje."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sales-consultant-modal__overlay" onClick={handleClose}>
      <div
        className="sales-consultant-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sales-consultant-modal__header">
          <div>
            <p className="sales-consultant-modal__eyebrow">
              Prijava za konsultanta
            </p>
            <h2 className="sales-consultant-modal__title">
              Postanite konsultant prodaje
            </h2>
          </div>

          <button
            type="button"
            className="sales-consultant-modal__close"
            onClick={handleClose}
            aria-label="Zatvori modal"
          >
            ×
          </button>
        </div>

        <div className="sales-consultant-modal__body">
          {successMessage ? (
            <div className="sales-consultant-modal__success-card">
              <div className="sales-consultant-modal__success-logo-wrap">
                <img
                  src="/Zepter-Careers images/ZepterJobLogo.png"
                  alt="Zepter"
                  className="sales-consultant-modal__success-logo"
                />
              </div>
              <h3>Prijava je uspešno poslata</h3>
              <p>{successMessage}</p>
              <button
                type="button"
                className="sales-consultant-modal__submit"
                onClick={() => {
                  setSuccessMessage("");
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          ) : (
            <>
              <div className="sales-consultant-modal__grid">
                <div className="sales-consultant-modal__field">
                  <label>Ime *</label>
                  <input
                    type="text"
                    placeholder="Petar"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>

                <div className="sales-consultant-modal__field">
                  <label>Prezime *</label>
                  <input
                    type="text"
                    placeholder="Petrović"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>

              <div className="sales-consultant-modal__grid">
                <div className="sales-consultant-modal__field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="petar@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="sales-consultant-modal__field">
                  <label>Broj telefona *</label>
                  <input
                    type="text"
                    placeholder="+381 65 215 99 55"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
              </div>

              <div className="sales-consultant-modal__grid">
                <div className="sales-consultant-modal__field">
                  <label>Država *</label>
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <option value="">Izaberite državu</option>
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sales-consultant-modal__field">
                  <label>Grad</label>
                  <input
                    type="text"
                    placeholder="Beograd"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                </div>
              </div>

              <div className="sales-consultant-modal__field">
                <label htmlFor="sales-consultant-cv">CV (opciono)</label>
                <label
                  htmlFor="sales-consultant-cv"
                  className="sales-consultant-modal__upload-box"
                >
                  <span
                    className={`sales-consultant-modal__upload-text ${
                      cvFile
                        ? "sales-consultant-modal__upload-text--selected"
                        : ""
                    }`}
                  >
                    {cvFile ? cvFile.name : "Izaberite CV fajl"}
                  </span>
                  <input
                    id="sales-consultant-cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                  />
                </label>
                <p className="sales-consultant-modal__file-note">
                  Prihvaćeni formati: PDF, DOC, DOCX. Maksimalna veličina je 10 MB.
                </p>
              </div>

              <div className="sales-consultant-modal__field">
                <label>Kratka poruka / Motivacija</label>
                <textarea
                  placeholder="Napišite zašto želite da postanete Zepter konsultant prodaje..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              <label className="sales-consultant-modal__checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>
                  Slažem se sa{" "}
                  <a
                    href="https://www.zepter.rs/rules/regulation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Uslovima korišćenja
                  </a>{" "}
                  i potvrđujem da će moji podaci biti korišćeni u skladu sa{" "}
                  <a
                    href="https://www.zepter.rs/rules/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Politikom privatnosti
                  </a>
                  .
                </span>
              </label>

              {submitError ? (
                <p className="sales-consultant-modal__error">{submitError}</p>
              ) : null}

              <button
                type="button"
                className="sales-consultant-modal__submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Slanje..." : "Pošalji prijavu"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesConsultantModal;
