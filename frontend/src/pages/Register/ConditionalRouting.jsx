import { useParams, Navigate } from "react-router-dom";
import RegisterAccount from "./RegisterAccount"

const ConditionalRegisterRoute = () => {
  const { accountType } = useParams();

  if (accountType === "employer") {
    return <Navigate to={`/register/${accountType}/type`} replace />;
  }

  return <RegisterAccount />;
};

export default ConditionalRegisterRoute