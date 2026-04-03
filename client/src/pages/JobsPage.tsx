import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import JobsHeroSection from "../components/JobsHeroSection";
import JobsResultsSection from "../components/JobsResultsSection";
import "../styles/jobs.css";

const JobsPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />
      <JobsHeroSection />
      <JobsResultsSection />
      <Footer onOpenNotifications={openNotifications} />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={closeNotifications}
      />
    </>
  );
};

export default JobsPage;