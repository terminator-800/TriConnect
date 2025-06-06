import { Routes, Route } from "react-router-dom";
import RegisterType from "../UserType";
import ConditionalRouting from "./ConditionalRouting";
import EmployerType from "../EmployerType";
import RegisterAccount from "../VerifciationForms/RegisterAccount";
import VerifyAccount from "../../components/VerifyAccount";

const RegisterRoutes = () => (
  <Routes>
    <Route path="" element={<RegisterType />} />
    <Route path=":accountType" element={<ConditionalRouting />} />
    <Route path=":accountType/verify" element={<VerifyAccount />} />
    <Route path=":accountType/:type" element={<EmployerType />} />
    <Route path=":accountType/:type/account" element={<RegisterAccount />} />
    <Route path=":accountType/:type/account/verify" element={<VerifyAccount />} />
  </Routes>
);

export default RegisterRoutes;