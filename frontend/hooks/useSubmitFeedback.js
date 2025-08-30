import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useSubmitFeedback = (role, onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${role}/feedback`,
        feedback,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedback', role]);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        alert("You have already submitted feedback. Thank you!");
      } else {
        console.error('Failed to submit feedback:', error);
        alert('Something went wrong while submitting feedback.');
      }
    },
  });
};
