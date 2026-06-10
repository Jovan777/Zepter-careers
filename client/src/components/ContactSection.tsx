import { useMemo, useState } from "react";
import { submitContactMessage } from "../api/contactApi";

const countryOptions = [
  { value: "serbia", label: "Srbija" },
  { value: "bosnia", label: "Bosna i Hercegovina" },
  { value: "croatia", label: "Hrvatska" },
  { value: "montenegro", label: "Crna Goraaaaa" },
];

const contactReasonOptions = [
  { value: "support", label: "Podrška" },
  { value: "complaint", label: "Primedbe" },
  { value: "question", label: "Pitanja" },
  { value: "career", label: "Karijera" },
];

const isEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const ContactSection = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [contactReason, setContactReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationError = useMemo(() => {
    if (!firstName.trim()) return "Ime je obavezno.";
    if (!lastName.trim()) return "Prezime je obavezno.";
    if (!email.trim()) return "Email je obavezan.";
    if (!isEmailValid(email)) return "Unesite ispravnu email adresu.";
    if (!phone.trim()) return "Broj telefona je obavezan.";
    if (!country) return "Izaberite državu.";
    if (!contactReason) return "Izaberite razlog kontaktiranja.";
    if (!message.trim()) return "Poruka je obavezna.";
    return "";
  }, [contactReason, country, email, firstName, lastName, message, phone]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCountry("");
    setContactReason("");
    setMessage("");
  };

  const clearMessages = () => {
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      setSubmitError(validationError);
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      clearMessages();

      const response = await submitContactMessage({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        contactReason,
        message: message.trim(),
        locale: "sr",
      });

      resetForm();
      setSuccessMessage(response.message || "Poruka je uspešno poslata.");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Greška pri slanju poruke. Pokušajte ponovo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="contact-section">
      <div className="container">
        <div className="contact-section__header">
          <p className="contact-section__eyebrow">Zepter Careers</p>
          <h2 className="contact-section__title">Kontakt</h2>
          <p className="contact-section__intro">
            Imate pitanje, sugestiju ili vam je potrebna podrška? Pošaljite nam
            poruku i naš tim će vam odgovoriti u najkraćem roku.
          </p>
        </div>

        <form className="contact-section__card" onSubmit={handleSubmit}>
          <div className="contact-section__grid">
            <label className="contact-section__field">
              <span>Ime *</span>
              <input
                type="text"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  clearMessages();
                }}
                placeholder="Petar"
              />
            </label>

            <label className="contact-section__field">
              <span>Prezime *</span>
              <input
                type="text"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  clearMessages();
                }}
                placeholder="Petrović"
              />
            </label>
          </div>

          <div className="contact-section__grid">
            <label className="contact-section__field">
              <span>Email *</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearMessages();
                }}
                placeholder="petar@example.com"
              />
            </label>

            <label className="contact-section__field">
              <span>Broj telefona *</span>
              <input
                type="text"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  clearMessages();
                }}
                placeholder="+381 65 215 99 55"
              />
            </label>
          </div>

          <div className="contact-section__grid">
            <label className="contact-section__field">
              <span>Država *</span>
              <select
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  clearMessages();
                }}
              >
                <option value="">Izaberite državu</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="contact-section__field">
              <span>Razlog kontaktiranja *</span>
              <select
                value={contactReason}
                onChange={(event) => {
                  setContactReason(event.target.value);
                  clearMessages();
                }}
              >
                <option value="">Izaberite razlog</option>
                {contactReasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="contact-section__field">
            <span>Poruka *</span>
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                clearMessages();
              }}
              placeholder="Napišite poruku..."
            />
          </label>

          {submitError ? (
            <p className="contact-section__error">{submitError}</p>
          ) : null}

          {successMessage ? (
            <div className="contact-section__success">
              <strong>Poruka je uspešno poslata</strong>
              <span>
                Hvala vam što ste nas kontaktirali. Naš tim će pregledati vašu
                poruku i odgovoriti vam u najkraćem roku.
              </span>
            </div>
          ) : null}

          <button
            type="submit"
            className="contact-section__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Slanje..." : "Pošalji poruku"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
