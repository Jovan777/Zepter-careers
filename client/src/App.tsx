import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";

import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/components/AdminLayout";

import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminJobsPage from "./admin/pages/AdminJobsPage";
import AdminJobEditorPage from "./admin/pages/AdminJobEditorPage";
import AdminTranslationsPage from "./admin/pages/AdminTranslationsPage";
import AdminApplicationsPage from "./admin/pages/AdminApplicationsPage";
import AdminApplicationDetailsPage from "./admin/pages/AdminApplicationDetailsPage";
import AdminCandidatesPage from "./admin/pages/AdminCandidatesPage";
import AdminCandidateDetailsPage from "./admin/pages/AdminCandidateDetailsPage";
import AdminCompaniesPage from "./admin/pages/AdminCompaniesPage";
import AdminRegionsPage from "./admin/pages/AdminRegionsPage";
import AdminPresencesPage from "./admin/pages/AdminPresencesPage";
import AdminSchedulerPage from "./admin/pages/AdminSchedulerPage";
import ProcessPage from "./pages/ProcessPage";
import FaqPage from "./pages/FaqPage";
import OurTeamPage from "./pages/OurTeamPage";

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/our-team" element={<OurTeamPage />} />


        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="jobs/new" element={<AdminJobEditorPage mode="create" />} />
          <Route path="jobs/:publicId" element={<AdminJobEditorPage mode="edit" />} />
          <Route path="translations" element={<AdminTranslationsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="applications/:publicId" element={<AdminApplicationDetailsPage />} />
          <Route path="candidates" element={<AdminCandidatesPage />} />
          <Route path="candidates/:publicId" element={<AdminCandidateDetailsPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="regions" element={<AdminRegionsPage />} />
          <Route path="presences" element={<AdminPresencesPage />} />
          <Route path="scheduler" element={<AdminSchedulerPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;