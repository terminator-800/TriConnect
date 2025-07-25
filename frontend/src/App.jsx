import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRoutes from "./pages/Register/RegisterRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import PrivateRoute from "./pages/Dashboards/PrivateRoute";
import PublicRoute from "./pages/PublicRoute";

// Dashboards
import JobseekerDashboard from "./pages/Dashboards/Jobseeker/JobseekerDashboard";
import BusinessEmployerDashboard from "./pages/Dashboards/BusinessEmployer/BusinessEmployerDashboard";
import IndividualEmployerDashboard from "./pages/Dashboards/IndividualEmployer/IndividualEmployerDashboard";
import ManpowerProviderDashboard from "./pages/Dashboards/ManpowerProvider/ManpowerProviderDashboard";
import AdministratorDashboard from "./pages/Dashboards/Administrator/AdministratorDashboard";

// Profiles
import JobseekerProfile from "./pages/Dashboards/Jobseeker/Profile/Profile";
import BusinessProfile from './pages/Dashboards/BusinessEmployer/Profile/Profile'
import ManpowerProviderProfile from "./pages/Dashboards/ManpowerProvider/Profile/Profile";
import IndividualEmployerProfile from './pages/Dashboards/IndividualEmployer/Profile/Profile'

// Individual Employer
import IndividualEmployerManageJobPost from "./pages/Dashboards/IndividualEmployer/ManageJobPost/ManageJobPost";
import IndividualEmployerCreateJobPost from "./pages/Dashboards/IndividualEmployer/Job Post/CreateJobPost";
import IndividualEmployerFindAgency from './pages/Dashboards/IndividualEmployer/FindAgency/FindAgency'
import IndividualEmployerMessage from './pages/Dashboards/IndividualEmployer/Message/Message'
import IndividualEmployerViewApplicant from './pages/Dashboards/IndividualEmployer/ViewApplicant'
import IndividualEmployerJobPostDetails from './pages/Dashboards/IndividualEmployer/JobPostDetails'

// Business Employer
import BusinessEmployerFindAgency from './pages/Dashboards/BusinessEmployer/FindAgency/FindAgency';
import ViewApplicant from './pages/Dashboards/BusinessEmployer/ViewApplicant';
import BusinessEmployerCreateJobPost from './pages/Dashboards/BusinessEmployer/Job Post/CreateJobPost';
import BusinessEmployerManageJobPost from './pages/Dashboards/BusinessEmployer/Manage Job Post/ManageJobPost';
import JobPostDetails from './pages/Dashboards/BusinessEmployer/JobPostDetails';
import BusinessEmployerMessage from './pages/Dashboards/BusinessEmployer/Message/Message';

// Jobseeker
import JobseekerFindJob from "./pages/Dashboards/Jobseeker/Find Job/FindJob";
import JobseekerFindAgency from "./pages/Dashboards/Jobseeker/FindAgency/FindAgency";
import JobseekerMessage from "./pages/Dashboards/Jobseeker/Message/Message";

// Manpower Provider
import ManpowerProviderFindJob from './pages/Dashboards/ManpowerProvider/FindJob/FindJob'
import ManpowerProviderCreateJobPost from './pages/Dashboards/ManpowerProvider/JobPost/CreateJobPost'
import ManpowerProviderMessage from './pages/Dashboards/ManpowerProvider/Message/Message'
import ManpowerProviderManageJobPost from './pages/Dashboards/ManpowerProvider/Manage Job Post/ManageJobPost'

// Administrator
import UserVerification from './pages/Dashboards/Administrator/User Verification/UserVerification'
import VerifiedUser from './pages/Dashboards/Administrator/VerifiedUser'
import JobPostVerification from './pages/Dashboards/Administrator/Jobpost Verification/JobPostVerification'
import VerifiedJobPost from './pages/Dashboards/Administrator/VerifiedJobPost'
import ReportedUsers from './pages/Dashboards/Administrator/ReportedUsers/ReportedUsers'
import UserFeedback from './pages/Dashboards/Administrator/UserFeedback/UserFeedback'

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/register/*"
          element={
            <PublicRoute>
              <RegisterRoutes />
            </PublicRoute>
          }
        />


        {/* Private Routes for Dashboards */}

        {/* Jobseeker */}
        <Route path="/jobseeker/*" element={<PrivateRoute />}>
          <Route index element={<JobseekerDashboard />} />
          <Route path="profile/*" element={<JobseekerProfile />} />
          <Route path="jobs" element={<JobseekerFindJob />} />
          <Route path="agencies" element={<JobseekerFindAgency />} />
          <Route path="message" element={<JobseekerMessage />} />
        </Route>

        {/* Business Employer */}
        <Route path="/business-employer/*" element={<PrivateRoute />}>
          <Route index element={<BusinessEmployerDashboard />} />
          <Route path="profile/*" element={<BusinessProfile />} />
          <Route path="post" element={<JobPostDetails />} />
          <Route path="manage" element={<BusinessEmployerManageJobPost />} />
          <Route path="create" element={<BusinessEmployerCreateJobPost />} />
          <Route path="view" element={<ViewApplicant />} />
          <Route path="find" element={<BusinessEmployerFindAgency />} />
          <Route path="message" element={<BusinessEmployerMessage />} />
        </Route>

        {/* Individual Employer */}
        <Route path="/individual-employer/*" element={<PrivateRoute />}>
          <Route index element={<IndividualEmployerDashboard />} />
          <Route path="profile/*" element={<IndividualEmployerProfile />} />
          <Route path="post" element={<IndividualEmployerJobPostDetails />} />
          <Route path="manage" element={<IndividualEmployerManageJobPost />} />
          <Route path="create" element={<IndividualEmployerCreateJobPost />} />
          <Route path="view" element={<IndividualEmployerViewApplicant />} />
          <Route path="find" element={<IndividualEmployerFindAgency />} />
          <Route path="message" element={<IndividualEmployerMessage />} />
        </Route>

        {/* Manpower Provider */}
        <Route path="/manpower-provider/*" element={<PrivateRoute />}>
          <Route index element={<ManpowerProviderDashboard />} />
          <Route path="profile/*" element={<ManpowerProviderProfile />} />
          <Route path="jobs" element={<ManpowerProviderFindJob />} />
          <Route path="create" element={<ManpowerProviderCreateJobPost />} />
          <Route path="manage" element={<ManpowerProviderManageJobPost />} />
          <Route path="message" element={<ManpowerProviderMessage />} />
        </Route>

        {/* Administrator */}
        <Route path="/administrator/*" element={<PrivateRoute />}>
          <Route index element={<AdministratorDashboard />} />
          <Route path="verification" element={<UserVerification />} />
          <Route path="verified" element={<VerifiedUser />} />
          <Route path="job-post-verification" element={<JobPostVerification />} />
          <Route path="verified-job-post" element={<VerifiedJobPost />} />
          <Route path="reported" element={<ReportedUsers />} />
          <Route path="feedback" element={<UserFeedback />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;