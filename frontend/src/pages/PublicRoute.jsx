import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ROLE } from '../../utils/role';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          setAuthStatus(res.data.role);
        } else {
          setAuthStatus(false);
        }
      } catch (error) {
        setAuthStatus(false);
      }
    };

    checkAuth();
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  if (authStatus) {
    switch (authStatus) {
      case ROLE.JOBSEEKER:
        return <Navigate to={`/${ROLE.JOBSEEKER}`} />;
      case ROLE.BUSINESS_EMPLOYER:
        return <Navigate to={`/${ROLE.BUSINESS_EMPLOYER}`} />;
      case ROLE.INDIVIDUAL_EMPLOYER:
        return <Navigate to={`${ROLE.INDIVIDUAL_EMPLOYER}`} />;
      case ROLE.MANPOWER_PROVIDER:
        return <Navigate to={`${ROLE.MANPOWER_PROVIDER}`} />;
      case ROLE.ADMININISTRATOR:
        return <Navigate to={`${ROLE.ADMININISTRATOR}`} />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
