import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRoutes from "./pages/Register/RegisterRoutes";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import PrivateRoute from "./pages/Dashboards/PrivateRoute";
import ProtectedRoute from "./pages/ProtectedRoute";

import JobseekerDashboard from "./pages/Dashboards/Jobseeker/JobseekerDashboard";
import BusinessEmployerDashboard from "./pages/Dashboards/BusinessEmployer/BusinessEmployerDashboard";
import IndividualEmployerDashboard from "./pages/Dashboards/IndividualEmployerDashboard";
import ManpowerProviderDashboard from "./pages/Dashboards/ManpowerProviderDashboard";
import AdminDashboard from "./pages/Dashboards/Administrator/AdminDashboard";
import JobseekerProfile from "./pages/Dashboards/Jobseeker/JobseekerProfile";

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
        <Route path="/jobseeker/*" element={<PrivateRoute />}>
          <Route index element={<JobseekerDashboard />} />
          <Route path="profile/*" element={<JobseekerProfile />} />
        </Route>
        
        <Route path="/business-employer/*" element={<PrivateRoute />}>
          <Route index element={<BusinessEmployerDashboard />} />
        </Route>
        <Route path="/individual-employer/*" element={<PrivateRoute />}>
          <Route index element={<IndividualEmployerDashboard />} />
        </Route>
        <Route path="/manpower-provider/*" element={<PrivateRoute />}>
          <Route index element={<ManpowerProviderDashboard />} />
        </Route>
        <Route path="/admin/*" element={<PrivateRoute />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;