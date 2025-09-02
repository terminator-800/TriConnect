import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`/logout`, {}, { withCredentials: true, });

      if (response.status === 200) {
        // Always clear fallback token in case cookies were blocked
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed. Please try again.');
      // Optional: surface a toast/alert here if needed
      localStorage.removeItem('token');
    } finally {
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  }, [navigate]);

  return { logout, isLoading, error };
};


