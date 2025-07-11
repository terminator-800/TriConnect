import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query';
=======
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
import socket from '../utils/socket';
import messageApi from '../api/messageApi';

export const useChat = (roomId, user_id, role) => {
  const [messages, setMessages] = useState([]);

<<<<<<< HEAD
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
=======
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
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
      }
    };

    const handleMessagesSeen = ({ conversation_id, message_ids }) => {
<<<<<<< HEAD
      
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
=======
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
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
};
