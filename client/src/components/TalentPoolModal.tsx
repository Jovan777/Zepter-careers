import { useMemo, useState } from "react";
import { submitTalentPoolApplication } from "../api/talentPoolApi";

type TalentPoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const areaOfInterestOptions = [
  { value: "sales", label: "Prodaja" },
  { value: "marketing", label: "Marketing" },
  { value: "it", label: "IT" },
  { value: "finance", label: "Finansije" },
  { value: "hr", label: "HR" },
  { value: "management", label: "Menadžment" },
  { value: "administration", label: "Administracija" },
  { value: "logistics", label: "Logistika" },
  { value: "legal", label: "Pravo" },
  { value: "customer_support", label: "Korisnička podrška" },
  { value: "other", label: "Drugo" },
];

const isEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isSupportedCvFile = (file: File | null) => {
  if (!file) return false;
  return /\.(pdf|doc|docx)$/i.test(file.name);
};

const TalentPoolModal = ({ isOpen, onClose }: TalentPoolModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
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
    if (!areaOfInterest) return "Izaberite oblast interesovanja.";
    if (!cvFile) return "CV je obavezan.";
    if (!isSupportedCvFile(cvFile)) return "CV mora biti PDF, DOC ili DOCX fajl.";
    if (!acceptedTerms) {
      return "Morate prihvatiti uslove korišćenja i politiku privatnosti.";
    }
    return "";
  }, [acceptedTerms, areaOfInterest, cvFile, email, firstName, lastName]);

  const isFormValid = validationError === "";

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAreaOfInterest("");
    setCvFile(null);
    setMessage("");
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
    if (!isFormValid || !cvFile) {
      setSubmitError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await submitTalentPoolApplication({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        areaOfInterest,
        message: message.trim(),
        acceptedTerms,
        marketingConsent,
        locale: "sr",
        cv: cvFile,
      });

      setSuccessMessage("Vaša otvorena prijava je uspešno poslata.");
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Greška pri slanju otvorene prijave."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="talent-pool-modal__overlay" onClick={handleClose}>
      <div className="talent-pool-modal" onClick={(event) => event.stopPropagation()}>
        <div className="talent-pool-modal__header">
          <div>
            <p className="talent-pool-modal__eyebrow">Otvorena prijava</p>
            <h2 className="talent-pool-modal__title">
              Pošaljite podatke našem HR timu
            </h2>
          </div>

          <button
            type="button"
            className="talent-pool-modal__close"
            onClick={handleClose}
            aria-label="Zatvori modal"
          >
            ×
          </button>
        </div>

        <div className="talent-pool-modal__body">
          {successMessage ? (
            <div className="talent-pool-modal__success-card">
              <div className="talent-pool-modal__success-logo-wrap">
                <img
                  src="/Zepter-Careers images/ZepterJobLogo.png"
                  alt="Zepter"
                  className="talent-pool-modal__success-logo"
                />
              </div>
              <h3>Uspešno ste poslali otvorenu prijavu</h3>
              <p>
                Hvala vam na interesovanju za rad u kompaniji Zepter. Naš HR tim
                će razmotriti vašu prijavu i kontaktirati vas kada se pojavi
                odgovarajuća prilika.
              </p>
              <button
                type="button"
                className="talent-pool-modal__submit"
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
              <div className="talent-pool-modal__grid">
                <div className="talent-pool-modal__field">
                  <label>Ime *</label>
                  <input
                    type="text"
                    placeholder="Petar"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>

                <div className="talent-pool-modal__field">
                  <label>Prezime *</label>
                  <input
                    type="text"
                    placeholder="Petrović"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>

              <div className="talent-pool-modal__grid">
                <div className="talent-pool-modal__field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="petar@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="talent-pool-modal__field">
                  <label>Telefon</label>
                  <input
                    type="text"
                    placeholder="+381 65 215 99 55"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
              </div>

              <div className="talent-pool-modal__field">
                <label>Oblast interesovanja *</label>
                <select
                  value={areaOfInterest}
                  onChange={(event) => setAreaOfInterest(event.target.value)}
                  required
                >
                  <option value="">Izaberite oblast</option>
                  {areaOfInterestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="talent-pool-modal__field">
                <label htmlFor="talent-pool-cv">CV *</label>
                <label
                  htmlFor="talent-pool-cv"
                  className="talent-pool-modal__upload-box"
                >
                  <span
                    className={`talent-pool-modal__upload-text ${
                      cvFile ? "talent-pool-modal__upload-text--selected" : ""
                    }`}
                  >
                    {cvFile ? cvFile.name : "Izaberite CV fajl"}
                  </span>
                  <input
                    id="talent-pool-cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                  />
                </label>
                <p className="talent-pool-modal__file-note">
                  Prihvaćeni formati: PDF, DOC, DOCX. Maksimalna veličina je 10 MB.
                </p>
              </div>

              <div className="talent-pool-modal__field">
                <label>Kratka napomena</label>
                <textarea
                  placeholder="Napišite u kojoj oblasti želite da se razvijate..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              <label className="talent-pool-modal__checkbox">
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
                <p className="talent-pool-modal__error">{submitError}</p>
              ) : null}

              <button
                type="button"
                className="talent-pool-modal__submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Slanje..." : "Pošalji otvorenu prijavu"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentPoolModal;
