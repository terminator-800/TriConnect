import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, useRef, createContext, useContext } from "react";
import axios from "axios";
import { useSocket } from "../hooks/useSocket";
import { useGlobalNotifications } from "../hooks/useGlobalNotifications";
import SocketStatus from "./components/SocketStatus";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRoutes from "./pages/Register/RegisterRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import PrivateRoute from "./pages/Dashboards/PrivateRoute";
import PublicRoute from "./pages/PublicRoute";

// Profiles
import JobseekerProfile from "./pages/Dashboards/Jobseeker/Profile/Profile";
import BusinessProfile from './pages/Dashboards/BusinessEmployer/Profile/Profile'
import ManpowerProviderProfile from "./pages/Dashboards/ManpowerProvider/Profile/Profile";
import IndividualEmployerProfile from './pages/Dashboards/IndividualEmployer/Profile/Profile'

// Individual Employer
import IndividualEmployerManageJobPost from "./pages/Dashboards/IndividualEmployer/ManageJobPost/ManageJobPost";
import IndividualEmployerCreateJobPost from "./pages/Dashboards/IndividualEmployer/Job Post/CreateJobPost";
import IndividualEmployerFindAgency from './pages/Dashboards/IndividualEmployer/FindAgency/FindAgency'
import IndividualEmployerMessage from './pages/Dashboards/IndividualEmployer/Message/ChatLayout'
import IndividualEmployerViewApplicant from './pages/Dashboards/IndividualEmployer/ViewApplicant/ViewApplicantLayout'
import IndividualEmployerJobPostDetails from './pages/Dashboards/IndividualEmployer/JobPostDetails'

// Business Employer
import BusinessEmployerFindAgency from './pages/Dashboards/BusinessEmployer/FindAgency/FindAgency';
import ViewApplicant from './pages/Dashboards/BusinessEmployer/ViewApplicant/ViewApplicantLayout';
import BusinessEmployerCreateJobPost from './pages/Dashboards/BusinessEmployer/JobPost/CreateJobPost';
import BusinessEmployerManageJobPost from './pages/Dashboards/BusinessEmployer/ManageJobPost/ManageJobPost';
import JobPostDetails from './pages/Dashboards/BusinessEmployer/JobPostDetails';
import BusinessEmployerMessage from './pages/Dashboards/BusinessEmployer/Message/ChatLayout';

// Jobseeker
import JobseekerFindJob from "./pages/Dashboards/Jobseeker/Find Job/FindJob";
import JobseekerFindAgency from "./pages/Dashboards/Jobseeker/FindAgency/FindAgency";
import JobseekerMessage from "./pages/Dashboards/Jobseeker/Message/ChatLayout";

// Manpower Provider
import ManpowerProviderFindJob from './pages/Dashboards/ManpowerProvider/FindJob/FindJob'
import ManpowerProviderCreateJobPost from './pages/Dashboards/ManpowerProvider/JobPost/CreateJobPost'
import ManpowerProviderMessage from './pages/Dashboards/ManpowerProvider/Message/ChatLayout'
import ManpowerProviderManageJobPost from './pages/Dashboards/ManpowerProvider/ManageJobPost/ManageJobPost'
import ManpowerProviderViewApplicant from './pages/Dashboards/ManpowerProvider/ViewApplicant/ViewApplicantLayout'

// Administrator
import UserVerification from './pages/Dashboards/Administrator/UserVerification/UserVerification'
import VerifiedUser from './pages/Dashboards/Administrator/VerifiedUser'
import JobPostVerification from './pages/Dashboards/Administrator/JobpostVerification/JobPostVerification'
import VerifiedJobPost from './pages/Dashboards/Administrator/VerifiedJobPost'
import ReportedUsers from './pages/Dashboards/Administrator/ReportedUsers/ReportedUsers'
import UserFeedback from './pages/Dashboards/Administrator/UserFeedback/UserFeedback'
import ManpowerProviderJobPostDetails from "./pages/Dashboards/ManpowerProvider/JobPostDetails";

// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ authenticated: null, role: null, userId: null });
  const hasFetched = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
          withCredentials: true,
        });
        setAuthData({
          authenticated: data.authenticated,
          role: data.role,
          userId: data.user,
        });
      } catch {
        setAuthData({ authenticated: false, role: null, userId: null });
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

// Remove SocketProvider's auth check and just use context
const SocketProvider = ({ children }) => {
  const { userId, role } = useAuth();
  useSocket(userId, role);
  useGlobalNotifications(userId, role);
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
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
              {/* <Route element={<JobseekerDashboard />} /> */}
              <Route path="profile/*" index element={<JobseekerProfile />} />
              <Route path="jobs" element={<JobseekerFindJob />} />
              <Route path="agencies" element={<JobseekerFindAgency />} />
              <Route path="message" element={<JobseekerMessage />} />
            </Route>

            {/* Business Employer */}
            <Route path="/business-employer/*" element={<PrivateRoute />}>
              {/* <Route  element={<BusinessEmployerDashboard />} /> */}
              <Route path="profile/*" index element={<BusinessProfile />} />
              <Route path="dashboard"  element={<JobPostDetails />} />
              <Route path="manage" element={<BusinessEmployerManageJobPost />} />
              <Route path="create" element={<BusinessEmployerCreateJobPost />} />
              <Route path="view" element={<ViewApplicant />} />
              <Route path="find" element={<BusinessEmployerFindAgency />} />
              <Route path="message" element={<BusinessEmployerMessage />} />
            </Route>

            {/* Individual Employer */}
            <Route path="/individual-employer/*" element={<PrivateRoute />}>
              {/* <Route  element={<IndividualEmployerDashboard />} /> */}
              <Route path="profile/*" index element={<IndividualEmployerProfile />} />
              <Route path="dashboard" element={<IndividualEmployerJobPostDetails />} />
              <Route path="manage" element={<IndividualEmployerManageJobPost />} />
              <Route path="create" element={<IndividualEmployerCreateJobPost />} />
              <Route path="view" element={<IndividualEmployerViewApplicant />} />
              <Route path="find" element={<IndividualEmployerFindAgency />} />
              <Route path="message" element={<IndividualEmployerMessage />} />
            </Route>

            {/* Manpower Provider */}
            <Route path="/manpower-provider/*" element={<PrivateRoute />}>
              {/* <Route  element={<ManpowerProviderDashboard />} /> */}
              <Route path="profile/*" index element={<ManpowerProviderProfile />} />
              <Route path="dashboard" element={<ManpowerProviderJobPostDetails />} />
              <Route path="jobs" element={<ManpowerProviderFindJob />} />
              <Route path="create" element={<ManpowerProviderCreateJobPost />} />
              <Route path="manage" element={<ManpowerProviderManageJobPost />} />
              <Route path="message" element={<ManpowerProviderMessage />} />
              <Route path="view" element={<ManpowerProviderViewApplicant />} />
            </Route>

            {/* Administrator */}
            <Route path="/administrator/*" element={<PrivateRoute />}>
              {/* <Route  element={<AdministratorDashboard />} /> */}
              <Route path="verification" index element={<UserVerification />} />
              <Route path="verified" element={<VerifiedUser />} />
              <Route path="job-post-verification" element={<JobPostVerification />} />
              <Route path="verified-job-post" element={<VerifiedJobPost />} />
              <Route path="reported" element={<ReportedUsers />} />
              <Route path="feedback" element={<UserFeedback />} />
            </Route>

          </Routes>
        </Router>
        
        {/* Global Components */}
        <SocketStatus />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;