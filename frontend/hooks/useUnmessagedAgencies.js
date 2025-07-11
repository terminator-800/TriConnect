// hooks/useUnmessagedAgencies.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUnmessagedAgencies = (employerId, role) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['unmessaged-agencies', employerId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/unmessaged-agencies/${employerId}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: !!employerId, // only run when employerId is available
  });

  return {
    agencies: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    status: query.status,
    refetch: query.refetch,
  };
};
