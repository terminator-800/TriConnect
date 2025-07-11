import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthStatus(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      case "jobseeker":
        return <Navigate to="/jobseeker" />;
      case "business_employer":
        return <Navigate to="/business-employer" />;
      case "individual_employer":
        return <Navigate to="/individual-employer" />;
      case "manpower_provider":
        return <Navigate to="/manpower-provider" />;
      case "admin":
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
