import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BrandStrip from "./components/BrandStrip";
import "./styles/home.css";
import OpenPositionsSection from "./components/OpenPositionsSection";
import WhyZepterSection from "./components/WhyZepterSection";
import QuoteSection from "./components/QuoteSection";

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <BrandStrip />
      <OpenPositionsSection />
      <WhyZepterSection />
      <QuoteSection />
    </>
  );
}

export default App;