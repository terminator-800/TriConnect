import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import { ROLE } from "../../../utils/role";

const PrivateRoute = () => {
    const [authData, setAuthData] = useState({ authenticated: null, role: null });
    const location = useLocation();
    const hasFetched = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
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
        [ROLE.JOBSEEKER]: `/${ROLE.JOBSEEKER}`,
        [ROLE.BUSINESS_EMPLOYER]: `/${ROLE.BUSINESS_EMPLOYER}`,
        [ROLE.INDIVIDUAL_EMPLOYER]: `/${ROLE.INDIVIDUAL_EMPLOYER}`,
        [ROLE.MANPOWER_PROVIDER]: `/${ROLE.MANPOWER_PROVIDER}`,
        [ROLE.ADMINISTRATOR]: `/${ROLE.ADMINISTRATOR}`,
    };

    if (authData.authenticated === null) return <div>Loading...</div>;
    if (!authData.authenticated) return <Navigate to="/login" replace />;

    const expectedBasePath = roleToPath[authData.role];
    const isSubPathAllowed = location.pathname.startsWith(expectedBasePath);

    if (!isSubPathAllowed) {
        return <Navigate to={expectedBasePath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
