import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import BrandStrip from "../components/BrandStrip";
import OpenPositionsSection from "../components/OpenPositionsSection";
import WhyZepterSection from "../components/WhyZepterSection";
import QuoteSection from "../components/QuoteSection";
import ZepterClubSection from "../components/ZepterClubSection";
import ValuesSection from "../components/ValuesSection";
import SolutionSection from "../components/SolutionSection";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import { useState } from "react";
import "../styles/home.css";

const HomePage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />
      <HeroSection />
      <BrandStrip />
      <OpenPositionsSection />
      <WhyZepterSection />
      <QuoteSection />
      <ZepterClubSection />
      <ValuesSection />
      <SolutionSection />
      <Footer onOpenNotifications={openNotifications} />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={closeNotifications}
      />
    </>
  );
};

export default HomePage;