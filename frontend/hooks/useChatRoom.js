import { useEffect } from 'react';
import socket from '../utils/socket';

export const useChatRoom = (conversationId) => {
  useEffect(() => {
    if (!conversationId) return;

    // Join the conversation room
    socket.emit('joinRoom', conversationId);

    return () => {
      // Leave room when component unmounts or conversation changes
      socket.emit('leaveRoom', conversationId);
    };
  }, [conversationId]);
};