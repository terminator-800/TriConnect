import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useJobApplications = (role, userId) => {
  return useQuery({
    queryKey: ['jobApplications', role, userId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/job-applications/${userId}`
      );
      return response.data;
    },
    enabled: !!role && !!userId, 
  });
};
