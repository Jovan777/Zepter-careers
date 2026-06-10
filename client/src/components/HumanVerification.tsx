import { useId } from "react";
import "../styles/human-verification.css";

type HumanVerificationProps = {
  question: string;
  answer: string;
  error?: string;
  isLoading?: boolean;
  onAnswerChange: (value: string) => void;
  onRefresh: () => void;
};

const HumanVerification = ({
  question,
  answer,
  error,
  isLoading = false,
  onAnswerChange,
  onRefresh,
}: HumanVerificationProps) => {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="human-verification">
      <div className="human-verification__header">
        <label className="human-verification__label" htmlFor={inputId}>
          Bezbednosna provera *
        </label>
        <button
          type="button"
          className="human-verification__refresh"
          onClick={onRefresh}
          disabled={isLoading}
        >
          Osveži pitanje
        </button>
      </div>

      <div className="human-verification__panel">
        <p className="human-verification__question">
          {isLoading ? "Učitavanje pitanja..." : question || "Pitanje nije učitano."}
        </p>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Unesite rezultat"
          aria-describedby={error ? `${helperId} ${errorId}` : helperId}
          aria-invalid={Boolean(error)}
          disabled={isLoading}
        />
        <p id={helperId} className="human-verification__helper">
          Unesite rezultat kako bismo potvrdili da prijavu ne šalje automatizovani sistem.
        </p>
      </div>

      {error ? (
        <p id={errorId} className="human-verification__error">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default HumanVerification;
