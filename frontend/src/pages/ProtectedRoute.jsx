import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auth/verify-session', {
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