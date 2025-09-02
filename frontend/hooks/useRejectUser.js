import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/reject/user/${userId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      alert('User successfully rejected.');
      queryClient.invalidateQueries({ queryKey: ['submittedUsers'] });
    },
    onError: () => {
      alert('Something went wrong while rejecting the user.');
    },
  });
}
