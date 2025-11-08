import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ authenticated: null, role: null, userId: null });
  const hasFetched = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
          withCredentials: true,
        });
        setAuthData({
          authenticated: data.authenticated,
          role: data.role,
          userId: data.user,
        });
      } catch {
        setAuthData({ authenticated: false, role: null, userId: null });
      }
    };
    checkAuth();
  }, []);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};
