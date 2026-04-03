import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BrandStrip from "./components/BrandStrip";
import "./styles/home.css";
import OpenPositionsSection from "./components/OpenPositionsSection";
import WhyZepterSection from "./components/WhyZepterSection";
import QuoteSection from "./components/QuoteSection";
import ZepterClubSection from "./components/ZepterClubSection";
import ValuesSection from "./components/ValuesSection";
import SolutionSection from "./components/SolutionSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <BrandStrip />
      <OpenPositionsSection />
      <WhyZepterSection />
      <QuoteSection />
      <ZepterClubSection />
      <ValuesSection />
      <SolutionSection />
      <Footer />
    </>
  );
}

export default App;