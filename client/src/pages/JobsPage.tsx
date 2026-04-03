import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationModal from "../components/NotificationModal";
import JobsHeroSection from "../components/JobsHeroSection";
import JobsResultsSection from "../components/JobsResultsSection";
import "../styles/jobs.css";

export type JobsFiltersState = {
  search: string;
  region: string;
  locationType: string;
  workArea: string;
  employmentType: string;
  locale: string;
};

const JobsPage = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [filters, setFilters] = useState<JobsFiltersState>({
    search: "",
    region: "",
    locationType: "",
    workArea: "",
    employmentType: "",
    locale: "sr",
  });

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />

      <JobsHeroSection filters={filters} onChangeFilters={setFilters} />

      <JobsResultsSection filters={filters} />

      <Footer onOpenNotifications={openNotifications} />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={closeNotifications}
      />
    </>
  );
};

export default JobsPage;