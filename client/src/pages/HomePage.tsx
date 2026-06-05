import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import BrandStrip from "../components/BrandStrip";
import OpenPositionsSection from "../components/OpenPositionsSection";
import TalentPoolSection from "../components/TalentPoolSection";
import TalentPoolModal from "../components/TalentPoolModal";
import SalesConsultantSection from "../components/SalesConsultantSection";
import SalesConsultantModal from "../components/SalesConsultantModal";
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
  const [isSalesConsultantModalOpen, setIsSalesConsultantModalOpen] = useState(false);

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);
  const openTalentPool = () => setIsTalentPoolModalOpen(true);
  const closeTalentPool = () => setIsTalentPoolModalOpen(false);
  const openSalesConsultant = () => setIsSalesConsultantModalOpen(true);
  const closeSalesConsultant = () => setIsSalesConsultantModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />
      <HeroSection />
      <BrandStrip />
      <OpenPositionsSection />
      <TalentPoolSection onOpen={openTalentPool} />
      <SalesConsultantSection onOpen={openSalesConsultant} />
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
      <SalesConsultantModal
        isOpen={isSalesConsultantModalOpen}
        onClose={closeSalesConsultant}
      />
    </>
  );
};

export default HomePage;
