import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import BrandStrip from "../components/BrandStrip";
import OpenPositionsSection from "../components/OpenPositionsSection";
import TalentPoolSection from "../components/TalentPoolSection";
import TalentPoolModal from "../components/TalentPoolModal";
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
  const [isTalentPoolModalOpen, setIsTalentPoolModalOpen] = useState(false);

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);
  const openTalentPool = () => setIsTalentPoolModalOpen(true);
  const closeTalentPool = () => setIsTalentPoolModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />
      <HeroSection />
      <BrandStrip />
      <OpenPositionsSection />
      <TalentPoolSection onOpen={openTalentPool} />
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
      <TalentPoolModal
        isOpen={isTalentPoolModalOpen}
        onClose={closeTalentPool}
      />
    </>
  );
};

export default HomePage;
