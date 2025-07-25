import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useRestrictUser = () => {
  const queryClient = useQueryClient();

  const restrictUser = async ({ userId, reason }) => {
    if (!userId) throw new Error('User ID is required');

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/administrator/restrict-user`,
      {
        user_id: userId,
        reason: reason || 'Violation of terms',
      },
      {
        withCredentials: true, 
      }
    );

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: restrictUser,
    onSuccess: () => {
      // Invalidate cached queries so the UI reflects changes
      queryClient.invalidateQueries(['reported-users']);
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Failed to restrict user:', error);
    },
  });

  return mutation; 
};
