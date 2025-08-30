import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../utils/role';
import api from '../api/axios';

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
      const res = await api.post(`/login`, { email, password })

      if (res.status === 200) {
        // Fallback: store token in localStorage if cookies are blocked
        if (!navigator.cookieEnabled && res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

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


