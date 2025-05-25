import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobseekerDashboard from "./JobseekerDashboard"
import BusinessEmployerDashboard from "./BusinessEmployerDashboard";
import IndividualEmployerDashboard from "./IndividualEmployerDashboard";
import ManpowerProviderDashboard from "./ManpowerProviderDashboard";
import AdminDashboard from "./AdminDashboard";

function UserDashboard() {
  return (
      <Routes>
        {/* Dashboard routes */}
        <Route path="/jobseeker/*" element={<JobseekerDashboard />} />
        <Route path="/business-employer/*" element={<BusinessEmployerDashboard />} />
        <Route path="/individual-employer/*" element={<IndividualEmployerDashboard />} />
        <Route path="/manpower-provider/*" element={<ManpowerProviderDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
  );
}

export default UserDashboard;