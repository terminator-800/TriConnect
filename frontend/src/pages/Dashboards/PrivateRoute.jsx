import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
    const [authData, setAuthData] = useState({ authenticated: null, role: null });
    const location = useLocation();
    const hasFetched = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                const { data } = await axios.get("http://localhost:3001/auth/verify-session", {
                    withCredentials: true,
                });
                
                setAuthData({ authenticated: data.authenticated, role: data.role }); 
            } catch {
                setAuthData({ authenticated: false, role: null });
            }
        };
        
        checkAuth();
    }, []);

    const roleToPath = {
        jobseeker: "/jobseeker",
        business_employer: "/business-employer",
        individual_employer: "/individual-employer",
        manpower_provider: "/manpower-provider",
        admin: "/admin",
    };

    if (authData.authenticated === null) return <div>Loading...</div>;
    if (!authData.authenticated) return <Navigate to="/login" replace />;

    const expectedBasePath = roleToPath[authData.role];
    const isSubPathAllowed = location.pathname.startsWith(expectedBasePath);

    if (!isSubPathAllowed) {
        return <Navigate to={expectedBasePath} replace />;
    }

    // Render nested routes using Outlet
    return <Outlet />;
};

export default PrivateRoute;