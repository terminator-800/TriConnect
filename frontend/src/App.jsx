import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRoutes from "./pages/Register/RegisterRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import PrivateRoute from "./pages/Dashboards/PrivateRoute";
import ProtectedRoute from "./pages/ProtectedRoute";

// Dashboards
import JobseekerDashboard from "./pages/Dashboards/Jobseeker/JobseekerDashboard";
import BusinessEmployerDashboard from "./pages/Dashboards/BusinessEmployer/BusinessEmployerDashboard";
import IndividualEmployerDashboard from "./pages/Dashboards/IndividualEmployer/IndividualEmployerDashboard";
import ManpowerProviderDashboard from "./pages/Dashboards/ManpowerProvider/ManpowerProviderDashboard";
import AdministratorDashboard from "./pages/Dashboards/Administrator/AdministratorDashboard";

// Profiles
import JobseekerProfile from "./pages/Dashboards/Jobseeker/Profile";
import BusinessProfile from './pages/Dashboards/BusinessEmployer/Profile'
import ManpowerProviderProfile from "./pages/Dashboards/ManpowerProvider/Profile";
import IndividualEmployerProfile from './pages/Dashboards/IndividualEmployer/Profile'

// Individual Employer
import IndividualEmployerManageJobPost from "./pages/Dashboards/IndividualEmployer/ManageJobPost";
import IndividualEmployerCreateJobPost from "./pages/Dashboards/IndividualEmployer/CreateJobPost";
import IndividualEmployerFindAgency from './pages/Dashboards/IndividualEmployer/FindAgency'
import IndividualEmployerMessage from './pages/Dashboards/IndividualEmployer/Message'
import IndividualEmployerViewApplicant from './pages/Dashboards/IndividualEmployer/ViewApplicant'
import IndividualEmployerJobPostDetails from './pages/Dashboards/IndividualEmployer/JobPostDetails'

// Business Employer
import BusinessEmployerFindAgency from './pages/Dashboards/BusinessEmployer/FindAgency';
import ViewApplicant from './pages/Dashboards/BusinessEmployer/ViewApplicant';
import BusinessEmployerCreateJobPost from './pages/Dashboards/BusinessEmployer/CreateJobPost';
import BusinessEmployerManageJobPost from './pages/Dashboards/BusinessEmployer/ManageJobPost';
import JobPostDetails from './pages/Dashboards/BusinessEmployer/JobPostDetails';
import BusinessEmployerMessage from './pages/Dashboards/BusinessEmployer/Message';

// Jobseeker
import JobseekerFindJob from "./pages/Dashboards/Jobseeker/FindJob";
import JobseekerFindAgency from "./pages/Dashboards/Jobseeker/FindAgency";
import JobseekerMessage from "./pages/Dashboards/Jobseeker/Message";

// Manpower Provider
import ManpowerProviderFindJob from './pages/Dashboards/ManpowerProvider/FindJob'
import ManpowerProviderCreateJobPost from './pages/Dashboards/ManpowerProvider/CreateJobPost'
import ManpowerProviderMessage from './pages/Dashboards/ManpowerProvider/Message'

// Administrator
import UserVerification from './pages/Dashboards/Administrator/UserVerification'
import VerifiedUser from './pages/Dashboards/Administrator/VerifiedUser'
import JobPostVerification from './pages/Dashboards/Administrator/JobPostVerification'
import VerifiedJobPost from './pages/Dashboards/Administrator/VerifiedJobPost'
import ReportedUser from './pages/Dashboards/Administrator/ReportedUser'
import UserFeedback from './pages/Dashboards/Administrator/UserFeedback'

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password/reset-password"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register/*"
          element={
            <ProtectedRoute>
              <RegisterRoutes />
            </ProtectedRoute>
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
          <Route path="messages" element={<ManpowerProviderMessage />} />
        </Route>

        {/* Administrator */}
        <Route path="/admin/*" element={<PrivateRoute />}>
          <Route index element={<AdministratorDashboard />} />
          <Route path="verification" element={<UserVerification />} />
          <Route path="verified" element={<VerifiedUser />} />
          <Route path="job-post-verification" element={<JobPostVerification />} />
          <Route path="verified-job-post" element={<VerifiedJobPost />} />
          <Route path="reported" element={<ReportedUser />} />
          <Route path="feedback" element={<UserFeedback />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;