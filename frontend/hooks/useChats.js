import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import messageApi from '../api/messageApi';

export const useChat = (roomId, user_id, role) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleConnect = () => {
      if (roomId) socket.emit('joinRoom', roomId);
      if (user_id) socket.emit('register', user_id);
    };

    socket.on('connect', handleConnect);
    if (socket.connected) handleConnect();

    const handleReceiveMessage = async (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        return updated.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      });

      if (
        message.conversation_id === roomId &&
        message.sender_id !== user_id &&
        !message.is_read
      ) {
        try {
          await messageApi.markAsSeen([message.message_id], role, user_id);
        } catch (err) {
          console.error('Socket: Failed to mark message as seen:', err);
        }
      }
    };

    const handleMessagesSeen = ({ conversation_id, message_ids }) => {
      if (conversation_id !== roomId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          message_ids.includes(msg.message_id)
            ? { ...msg, is_read: true }
            : msg
        )
      );
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messagesSeen', handleMessagesSeen);

    const fetchPreviousMessages = async () => {
      try {
        const conversations = await messageApi.fetchConversations(role);
        const conv = conversations.find((c) => c.conversation_id === roomId);
        if (conv) {
          const previousMessages = await messageApi.fetchMessagesForConversations(role, [conv]);
          previousMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          setMessages(previousMessages);
        }
      } catch (err) {
        console.error('Failed to fetch previous messages:', err);
      }
    };

    if (roomId && role) fetchPreviousMessages();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messagesSeen', handleMessagesSeen);
    };
  }, [roomId, user_id, role]);

  return { messages, setMessages }; // ✅ Important!
};
