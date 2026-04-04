import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

const CustomSelect = ({
  placeholder,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  return (
    <div
      className={`custom-select ${className} ${
        isOpen ? "custom-select--open" : ""
      } ${disabled ? "custom-select--disabled" : ""}`}
      ref={containerRef}
    >
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        disabled={disabled}
      >
        <span
          className={`custom-select__value ${
            selectedOption ? "custom-select__value--selected" : ""
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="custom-select__arrow">▾</span>
      </button>

      {isOpen && !disabled && (
        <div className="custom-select__menu">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                className={`custom-select__option ${
                  isSelected ? "custom-select__option--selected" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;