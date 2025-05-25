import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRoutes from "./pages/RegisterRoutes"; // <-- import grouped routes
import UserDashboard from "./pages/Dashboards/UserDashboard"; // <-- import user dashboard routes
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/forgot-password/reset-password" element={<ResetPassword/>}></Route>
        <Route path="/dashboard/*" element={<UserDashboard/>}></Route>
        <Route path="/register/*" element={<RegisterRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;