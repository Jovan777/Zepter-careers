import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type LocationDropdownProps = {
  options: Option[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const LocationDropdown = ({
  options,
  value,
  placeholder = "Lokacija",
  onChange,
}: LocationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="location-dropdown" ref={wrapperRef}>
      <button
        type="button"
        className={`location-dropdown__trigger ${isOpen ? "location-dropdown__trigger--open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src="/Zepter-Careers images/VectorLoc.png"
          alt="Location"
          className="location-dropdown__icon"
        />

        <span className="location-dropdown__text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className={`location-dropdown__arrow ${isOpen ? "location-dropdown__arrow--open" : ""}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="location-dropdown__menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`location-dropdown__item ${
                value === option.value ? "location-dropdown__item--active" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;