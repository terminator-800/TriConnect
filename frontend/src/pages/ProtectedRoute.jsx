import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, redirectTo }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auth/verify-session', {
          withCredentials: true,
        });
        
        if (res.data.authenticated) {
          setAuthStatus(res.data.role); // Store the user's role
        } else {
          setAuthStatus(false); // Not authenticated
        }
      } catch (error) {
        setAuthStatus(false); // Error or not authenticated
      }
    };

    checkAuth();
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  if (authStatus) {
    // Redirect authenticated users to their respective dashboards
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

  return children; // Render the protected component for unauthenticated users
};

export default ProtectedRoute;