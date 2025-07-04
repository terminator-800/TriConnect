import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import socket from '../utils/socket';

const API = import.meta.env.VITE_API_URL;

export const useSendMessage = (role, user_id) => {

  return useMutation({
    mutationFn: async ({ receiver_id, message_text, file, conversation_id }) => {
      const formData = new FormData();
      formData.append('sender_id', user_id);
      formData.append('receiver_id', receiver_id);
      formData.append('message_text', message_text || '');
      formData.append('conversation_id', conversation_id); // ✅ use actual conversation_id

      if (file) {
        formData.append('file', file);
      }

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

    // onSuccess: (data, variables) => {
    //   socket.emit('sendMessage', {
    //     conversation_id: data.conversation_id,
    //     sender_id: user_id,
    //     receiver_id: variables.receiver_id,
    //     message_text: variables.message_text,
    //     file_url: data.file_url,
    //   });
    // },

    onError: (error) => {
      console.error('Message send failed:', error?.response?.data || error.message);
      alert('Failed to send message. Try again.');
    },
  });
};
