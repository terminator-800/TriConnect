import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import RegisterType from "./pages/UserType"
import Login from "./pages/Login"
import EmployerType from "./pages/EmployerType"
import ConditionalRouting from "./pages/ConditionalRouting"
import RegisterAccount from "./pages/RegisterForms/RegisterAccount"
import VerifyAccount from "./components/VerifyAccount"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterType />} />
          <Route path="/register/:accountType" element={<ConditionalRouting />} />
          <Route path="/register/:accountType/verify" element={<VerifyAccount />} />
          <Route path="/register/:accountType/:type" element={<EmployerType />} />
          <Route path="/register/:accountType/:type/account" element={<RegisterAccount />} />
          <Route path="/register/:accountType/:type/account/verify" element={<VerifyAccount />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
