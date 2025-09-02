import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useStatusChange = (role) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ jobPostId, status }) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${role}/${jobPostId}/${status}`,
        {}, 
        {
          withCredentials: true, 
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostsByUser'] });
    },
  });

  return {
    changeStatus: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    error: mutation.error,
    status: mutation.status,
  };
};
