import { publicAssetUrl } from "../config/urls";

const QuoteSection = () => {
  return (
    <section className="quote-section">
      <div className="quote-section__outer">
        <div className="quote-section__frame">
          <img
            src={publicAssetUrl("/Zepter-Careers images/Frame1.png")}
            alt="Philip Zepter quote"
            className="quote-section__image"
          />
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
