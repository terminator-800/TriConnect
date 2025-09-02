import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useDeleteJobPost = (role) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (jobPostId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/${role}/delete/jobpost/${jobPostId}`,
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
    deleteJobPost: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    error: mutation.error,
    status: mutation.status,
  };
};
