import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useConversations = (role) => {
  return useQuery({
    queryKey: ['conversations', role],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/conversations`,
        { withCredentials: true }
      );
      return response.data;
    },

    onError: () => {
      alert('Failed to fetch conversations. Please try again.');
    },

    staleTime: 1000 * 60,
  });
};

export const useMessageHistory = (role, conversation_id) => {
  return useQuery({
    queryKey: ['messages', role, conversation_id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/message-history/${conversation_id}`,
        { withCredentials: true }
      );
      return response.data;
    },

    enabled: !!role && !!conversation_id,
    staleTime: 1000 * 30,
    refetchOnMount: true,

    onError: () => {
      alert('Failed to fetch messages. Please try again.');
    }

  });
};

export const useMarkAsSeen = (role, conversation_id) => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async (message_id) => {

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${role}/mark-as-seen`,
        message_id,
        { withCredentials: true }
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', role, conversation_id] });
    },

    onError: () => {
      alert('Failed to mark message as seen. Please try again.');
    }

  });
};

export const useSendMessage = (role) => {
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
        `${import.meta.env.VITE_API_URL}/${role}/messages/send`,
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

    onError: () => {
      alert('Failed to send message. Try again.');
    }
    
  });
};





