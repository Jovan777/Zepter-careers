import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [filters, setFilters] = useState<JobsFiltersState>({
    search: "",
    region: "",
    locationType: "",
    workArea: "",
    employmentType: "",
    locale: "sr",
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      region: searchParams.get("region") || "",
      locationType: searchParams.get("locationType") || "",
      workArea: searchParams.get("workArea") || "",
      employmentType: searchParams.get("employmentType") || "",
      locale: searchParams.get("locale") || "sr",
    });
  }, [searchParams]);

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