import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const messageApi = {
  // 👉 Fetch conversations
  fetchConversations: async (role) => {
    const res = await axios.get(`${API}/${role}/conversations`, {
      withCredentials: true,
    });
    return res.data;
  },

  // 👉 Fetch all messages for a list of conversations
  fetchMessagesForConversations: async (role, conversations) => {
    const allMessages = [];

    for (const conv of conversations) {
      const res = await axios.get(`${API}/${role}/messages/${conv.conversation_id}`, {
        withCredentials: true,
      });
      allMessages.push(...res.data);
    }

    return allMessages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  },

  markAsSeen: async (messageIds, role, viewerId) => {
    return await axios.post(
      `${API}/${role}/messages/mark-as-seen`,
      { messageIds, viewerId },
      { withCredentials: true }
    );
  }

};

export default messageApi;
