import { useEffect, useMemo, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type CountrySearchSelectProps = {
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

const CountrySearchSelect = ({
  placeholder,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
}: CountrySearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch)
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
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
      setSearch("");
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={`custom-select country-search-select ${className} ${
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
            if (isOpen) {
              setSearch("");
            }
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
        <div className="custom-select__menu country-search-select__menu">
          <div className="country-search-select__search-wrap">
            <input
              ref={inputRef}
              type="text"
              className="country-search-select__search-input"
              placeholder="Pretraži državu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="country-search-select__options">
            <button
              type="button"
              className={`custom-select__option ${
                value === "" ? "custom-select__option--selected" : ""
              }`}
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
            >
              Sve regije
            </button>

            {filteredOptions.length ? (
              filteredOptions.map((option) => {
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
                      setSearch("");
                    }}
                  >
                    {option.label}
                  </button>
                );
              })
            ) : (
              <div className="country-search-select__empty">
                Nema pronađenih država.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySearchSelect;