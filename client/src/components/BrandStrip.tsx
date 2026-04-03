import { brandLogos } from "../data/brandLogos";

const BrandStrip = () => {
  return (
    <section className="brand-strip">
      <div className="container brand-strip__inner">
        {brandLogos.map((brand) => (
          <div key={brand.name} className="brand-strip__item">
            <img src={brand.src} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandStrip;