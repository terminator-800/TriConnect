import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROLE } from "../../utils/role"; 
import axios from "axios";

const PublicRoute = ({ children }) => {
  const [authData, setAuthData] = useState({ authenticated: null, role: null });
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
          withCredentials: true,
        });
        setAuthData({ authenticated: data.authenticated, role: data.role });
      } catch {
        const token = localStorage.getItem("token"); 
        if (token) {
          try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setAuthData({ authenticated: data.authenticated, role: data.role });
          } catch {
            setAuthData({ authenticated: false, role: null });
          }
        } else {
          setAuthData({ authenticated: false, role: null });
        }
      }
    };

    verifyToken();
  }, []);

  const roleToPath = {
    [ROLE.JOBSEEKER]: `/${ROLE.JOBSEEKER}/jobs`,
    [ROLE.BUSINESS_EMPLOYER]: `/${ROLE.BUSINESS_EMPLOYER}/dashboard`,
    [ROLE.INDIVIDUAL_EMPLOYER]: `/${ROLE.INDIVIDUAL_EMPLOYER}/dashboard`,
    [ROLE.MANPOWER_PROVIDER]: `/${ROLE.MANPOWER_PROVIDER}/dashboard`,
    [ROLE.ADMINISTRATOR]: `/${ROLE.ADMINISTRATOR}/verification`,
  };

  if (authData.authenticated === null) return <div>Public Route Loading...</div>;

  if (authData.authenticated) {
    const redirectPath = roleToPath[authData.role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export default PublicRoute;
