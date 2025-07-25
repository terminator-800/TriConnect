import { useQuery } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const useUserFeedbacks = () => {
  const query = useQuery({
    queryKey: ['user-feedbacks', ROLE.ADMINISTRATOR], 
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/user-feedbacks`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  return {
    feedbacks: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};
