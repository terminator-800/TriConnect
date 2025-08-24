import { useAuth } from '../App';
import { Navigate } from 'react-router-dom';
import { ROLE } from '../../utils/role';

const ProtectedRoute = ({ children }) => {
  const authData = useAuth();

  if (authData.authenticated === null) {
    return <div>Protected Route Loading ...</div>;
  }

  if (authData.authenticated) {
    switch (authData.role) {
      case ROLE.JOBSEEKER:
        return <Navigate to={`/${ROLE.JOBSEEKER}/jobs`} />;
      case ROLE.BUSINESS_EMPLOYER:
        return <Navigate to={`/${ROLE.BUSINESS_EMPLOYER}/dashboard`} />;
      case ROLE.INDIVIDUAL_EMPLOYER:
        return <Navigate to={`/${ROLE.INDIVIDUAL_EMPLOYER}/dashboard`} />;
      case ROLE.MANPOWER_PROVIDER:
        return <Navigate to={`/${ROLE.MANPOWER_PROVIDER}/dashboard`} />;
      case ROLE.ADMINISTRATOR:
        return <Navigate to={`/${ROLE.ADMINISTRATOR}/verification`} />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
