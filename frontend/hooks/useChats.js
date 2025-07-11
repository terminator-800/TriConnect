import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import socket from '../utils/socket';
import messageApi from '../api/messageApi';

export const useChat = (roomId, user_id, role) => {
  const [messages, setMessages] = useState([]);

  // 🧠 Log utility
  const log = (label, error) => {
    console.error(`❌ [${label} ERROR]:`, error);
  };

  const {
    data: previousMessagesData,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['chatMessages', role, roomId],
    queryFn: async () => {
      try {
        const conversations = await messageApi.fetchConversations(role);
        if (!Array.isArray(conversations)) {
          throw new Error('Conversations data is not an array');
        }

        const conv = conversations.find((c) => c.conversation_id === roomId);
        if (!conv) {
          throw new Error(`No conversation found with ID ${roomId}`);
        }

        const messages = await messageApi.fetchMessagesForConversations(role, [conv]);
        if (!Array.isArray(messages)) {
          throw new Error('Fetched messages are not an array');
        }

        return messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } catch (err) {
        log('Fetch Messages', err);
        throw err;
      }
    },
    enabled: !!roomId && !!role,
  });

  useEffect(() => {
    if (isSuccess && previousMessagesData) {
      setMessages(previousMessagesData);
    }
  }, [isSuccess, previousMessagesData]);

  // 🚨 Log query errors
  useEffect(() => {
    if (isError) {
      log('React Query', error);
    }
  }, [isError, error]);

  // 🔌 Handle sockets and message state updates
  useEffect(() => {
    const handleConnect = () => {
      try {
        if (roomId) socket.emit('joinRoom', roomId);
        if (user_id) socket.emit('register', user_id);
      } catch (err) {
        log('Socket Connect', err);
      }
    };

    const handleReceiveMessage = async (message) => {
      try {
        if (!message || typeof message !== 'object') {
          throw new Error('Received malformed message');
        }

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
            log('Mark as Seen', err);
          }
        }
      } catch (err) {
        log('Receive Message', err);
      }
    };

    const handleMessagesSeen = ({ conversation_id, message_ids }) => {
      
      try {
        if (!conversation_id || !Array.isArray(message_ids)) {
          throw new Error('Invalid messagesSeen payload');
        }

        if (conversation_id !== roomId) return;

        setMessages((prev) =>
          prev.map((msg) =>
            message_ids.includes(msg.message_id)
              ? { ...msg, is_read: true }
              : msg
          )
        );
      } catch (err) {
        log('Messages Seen', err);
      }
    };

    try {
      socket.on('connect', handleConnect);
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messagesSeen', handleMessagesSeen);
      
      if (socket.connected) {
        handleConnect();
      }
    } catch (err) {
      log('Socket Setup', err);
    }

    return () => {
      try {
        socket.off('connect', handleConnect);
        socket.off('receiveMessage', handleReceiveMessage);
        socket.off('messagesSeen', handleMessagesSeen);
      } catch (err) {
        log('Socket Cleanup', err);
      }
    };
  }, [roomId, user_id, role]);

  return { messages, setMessages };
};
