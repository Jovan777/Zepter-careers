import { brandLogos } from "../data/brandLogos";

const loopedLogos = [...brandLogos, ...brandLogos];

const BrandStrip = () => {
  return (
    <section className="brand-strip">
      <div className="brand-strip__viewport">
        <div className="brand-strip__track">
          {loopedLogos.map((brand, index) => (
            <a
              key={`${brand.name}-${index}`}
              href={brand.url}
              target="_blank"
              rel="noreferrer"
              className="brand-strip__item"
              aria-label={brand.name}
            >
              <img src={brand.src} alt={brand.name} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;