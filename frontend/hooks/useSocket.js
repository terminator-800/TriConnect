import { useEffect, useRef } from 'react';
import socket from '../utils/socket';

export const useSocket = (userId, role) => {
  const isConnected = useRef(false);

  useEffect(() => {
    if (!userId || !role || isConnected.current) {
      return;
    }

    socket.emit('register', userId);
    isConnected.current = true;

    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
      isConnected.current = false;
    });

    socket.on('connect_error', (error) => {
      isConnected.current = false;
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      isConnected.current = false;
    };
  }, [userId, role]);

  return { socket };
};