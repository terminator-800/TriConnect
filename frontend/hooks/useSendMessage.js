import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export const useSendMessage = (role) => {
  
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver_id, message_text, files, conversation_id }) => {
      const formData = new FormData();
      formData.append('receiver_id', receiver_id);
      formData.append('message_text', message_text || '');
      formData.append('conversation_id', conversation_id);

      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await axios.post(
        `${API}/${role}/messages/send`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['messages', variables.conversation_id]);
    },

    onError: (error) => {
      console.error('Message send failed:', error?.response?.data || error.message);
      alert('Failed to send message. Try again.');
    },
  });
};
