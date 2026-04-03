import { brandLogos } from "../data/brandLogos";

const loopedLogos = [...brandLogos, ...brandLogos];

const BrandStrip = () => {
  return (
    <section className="brand-strip">
      <div className="brand-strip__viewport">
        <div className="brand-strip__track">
          {loopedLogos.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="brand-strip__item">
              <img src={brand.src} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;