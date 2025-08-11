import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../utils/role';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const roleToPath = {
    [ROLE.JOBSEEKER]: `/${ROLE.JOBSEEKER}/jobs`,
    [ROLE.BUSINESS_EMPLOYER]: `/${ROLE.BUSINESS_EMPLOYER}/dashboard`,
    [ROLE.INDIVIDUAL_EMPLOYER]: `/${ROLE.INDIVIDUAL_EMPLOYER}/dashboard`,
    [ROLE.MANPOWER_PROVIDER]: `/${ROLE.MANPOWER_PROVIDER}/dashboard`,
    [ROLE.ADMINISTRATOR]: `/${ROLE.ADMINISTRATOR}/verification`,
  };

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, 
        { email, password },
         { withCredentials: true });

      if (res.status === 200) {
        const target = roleToPath[res.data.role] ?? '/';
        navigate(target);
      }
      return res.data;
      
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
};


