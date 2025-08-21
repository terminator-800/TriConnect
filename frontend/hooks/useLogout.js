import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
        withCredentials: true,
      });
      
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError(err);
      // Optional: surface a toast/alert here if needed
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return { logout, isLoading, error };
};


