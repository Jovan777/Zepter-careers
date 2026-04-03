import { useMemo, useState } from "react";

type ApplyJobModalProps = {
    isOpen: boolean;
    onClose: () => void;
    jobTitle?: string;
};

const ApplyJobModal = ({ isOpen, onClose, jobTitle }: ApplyJobModalProps) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [extraFiles, setExtraFiles] = useState<File[]>([]);
    const [coverLetter, setCoverLetter] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);

    const isFormValid = useMemo(() => {
        return Boolean(
            fullName.trim() &&
            email.trim() &&
            phone.trim() &&
            cvFile &&
            coverLetter.trim() &&
            acceptedTerms
        );
    }, [fullName, email, phone, cvFile, coverLetter, acceptedTerms]);

    if (!isOpen) return null;

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setCvFile(file);
    };

    const handleExtraFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setExtraFiles(files);
    };

    const handleSubmit = () => {
        if (!isFormValid) return;

        console.log({
            jobTitle,
            fullName,
            email,
            phone,
            cvFile,
            extraFiles,
            coverLetter,
            acceptedTerms,
            marketingConsent,
        });

        onClose();
    };

    return (
        <div className="apply-modal__overlay" onClick={onClose}>
            <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
                <div className="apply-modal__header">
                    <h2 className="apply-modal__title">Prijavi se na poziciju</h2>

                    <button
                        type="button"
                        className="apply-modal__close"
                        onClick={onClose}
                        aria-label="Zatvori modal"
                    >
                        ×
                    </button>
                </div>

                <div className="apply-modal__body">
                    <div className="apply-modal__field">
                        <label>Ime i prezime *</label>
                        <input
                            type="text"
                            placeholder="Petar Petrović"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="apply-modal__field">
                        <label>Email adresa *</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="apply-modal__field">
                        <label>Broj telefona *</label>
                        <input
                            type="text"
                            placeholder="+381 65 215 99 55"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="apply-modal__file-grid">
                        <div className="apply-modal__field">
                            <label htmlFor="cv-upload">Otpremanje biografije/CV-a *</label>

                            <label htmlFor="cv-upload" className="apply-modal__upload-box">
                                <span
                                    className={`apply-modal__upload-text ${cvFile ? "apply-modal__upload-text--selected" : ""
                                        }`}
                                >
                                    {cvFile ? cvFile.name : "Izaberite CV fajl"}
                                </span>
                                <input
                                    id="cv-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCvChange}
                                />
                            </label>

                            <p className="apply-modal__file-note">
                                Prihvaćeni formati: PDF, DOC, DOCX
                            </p>
                        </div>

                        <div className="apply-modal__field">
                            <label htmlFor="extra-files-upload">Dodatna dokumenta (opciono)</label>

                            <label htmlFor="extra-files-upload" className="apply-modal__upload-box">
                                <span
                                    className={`apply-modal__upload-text ${extraFiles.length > 0 ? "apply-modal__upload-text--selected" : ""
                                        }`}
                                >
                                    {extraFiles.length > 0
                                        ? `${extraFiles.length} fajl(a) odabrano`
                                        : "Diplome, sertifikati..."}
                                </span>
                                <input
                                    id="extra-files-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple
                                    onChange={handleExtraFilesChange}
                                />
                            </label>

                            {extraFiles.length > 0 && (
                                <div className="apply-modal__file-list">
                                    {extraFiles.map((file, index) => (
                                        <span
                                            key={`${file.name}-${index}`}
                                            className="apply-modal__file-chip"
                                            title={file.name}
                                        >
                                            {file.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="apply-modal__field">
                        <label>Propratno pismo *</label>
                        <textarea
                            placeholder="Recite nam zašto ste zainteresovani za ovu poziciju..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                    </div>

                    <label className="apply-modal__checkbox">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <span>
                            Slažem se sa <a href="#">Uslovima korišćenja</a> i potvrđujem da će
                            moji podaci biti korišćeni u skladu sa{" "}
                            <a href="#">Politikom privatnosti</a>. *
                        </span>
                    </label>

                    <label className="apply-modal__checkbox">
                        <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                        />
                        <span>
                            Želim da primam obaveštenja o Zepter proizvodima, akcijama i popustima.
                        </span>
                    </label>

                    <button
                        type="button"
                        className="apply-modal__submit"
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                    >
                        Pošalji prijavu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;