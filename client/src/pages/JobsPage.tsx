import { useState } from "react";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [filters, setFilters] = useState<JobsFiltersState>({
    search: searchParams.get("search") || "",
    region: searchParams.get("region") || "",
    locationType: searchParams.get("locationType") || "",
    workArea: searchParams.get("workArea") || "",
    employmentType: searchParams.get("employmentType") || "",
    locale: searchParams.get("locale") || "sr",
  });

  const applyFilters = (nextFilters: JobsFiltersState) => {
    setFilters(nextFilters);

    const nextParams = new URLSearchParams(searchParams);

    if (nextFilters.search) {
      nextParams.set("search", nextFilters.search);
    } else {
      nextParams.delete("search");
    }

    if (nextFilters.region) {
      nextParams.set("region", nextFilters.region);
    } else {
      nextParams.delete("region");
    }

    if (nextFilters.locationType) {
      nextParams.set("locationType", nextFilters.locationType);
    } else {
      nextParams.delete("locationType");
    }

    if (nextFilters.workArea) {
      nextParams.set("workArea", nextFilters.workArea);
    } else {
      nextParams.delete("workArea");
    }

    if (nextFilters.employmentType) {
      nextParams.set("employmentType", nextFilters.employmentType);
    } else {
      nextParams.delete("employmentType");
    }

    if (nextFilters.locale) {
      nextParams.set("locale", nextFilters.locale);
    } else {
      nextParams.delete("locale");
    }

    nextParams.delete("job");

    setSearchParams(nextParams, { replace: true });
  };

  const openNotifications = () => setIsNotificationModalOpen(true);
  const closeNotifications = () => setIsNotificationModalOpen(false);

  return (
    <>
      <Header onOpenNotifications={openNotifications} />

      <JobsHeroSection
        filters={filters}
        onApplyFilters={applyFilters}
      />

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