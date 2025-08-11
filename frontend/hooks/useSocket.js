import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../utils/socket';

export const useSocket = (userId, role) => {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);

  useEffect(() => {
    if (!userId || !role || isConnected.current) {
      console.log(`🔌 Socket setup skipped: userId=${userId}, role=${role}, isConnected=${isConnected.current}`);
      return;
    }

    console.log(`🔌 Setting up socket for user ${userId} with role ${role}`);

    // Register user with socket
    socket.emit('register', userId);
    isConnected.current = true;
    console.log(`✅ User ${userId} registered with socket`);

    // Listen for connection events
    socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      isConnected.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      isConnected.current = false;
    });

    return () => {
      console.log(`🧹 Cleaning up socket for user ${userId}`);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      isConnected.current = false;
    };
  }, [userId, role]);

  return { socket };
};