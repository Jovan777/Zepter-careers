import { useState } from "react";
import Header from "../components/Header";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import "../styles/home.css";

const ContactPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  return (
    <>
      <Header onOpenNotifications={() => setIsNotificationModalOpen(true)} />
      <main className="contact-page">
        <ContactSection />
      </main>
      <Footer onOpenNotifications={() => setIsNotificationModalOpen(true)} />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
};

export default ContactPage;
