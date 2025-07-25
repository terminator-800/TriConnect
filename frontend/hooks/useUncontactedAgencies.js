import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUncontactedAgencies = (role) => {
  const query = useQuery({
    queryKey: ['uncontacted-agencies', role],  // include role for uniqueness
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/uncontacted-agencies`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  return {
    agencies: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

