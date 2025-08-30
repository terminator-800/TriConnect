import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../utils/socket';

export const useGlobalNotifications = (userId, role) => {
  const queryClient = useQueryClient();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const isInitialized = useRef(false);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!userId || !role || isInitialized.current) return;

    console.log(`🔔 Setting up global notifications for user ${userId}`);

    // Listen for new messages globally
    socket.on('receiveMessage', (newMessage) => {
      console.log('📨 Global notification received:', newMessage);
      
      // Check if this message is for the current user
      if (Number(newMessage.receiver_id) === Number(userId)) {
        handleNewMessage(newMessage);
      }
    });

    // Listen for messages seen updates
    socket.on('messagesSeen', (data) => {
      console.log('👁️ Global seen update:', data);
      updateUnreadCounts(data);
    });

    // Listen for conversation updates
    socket.on('conversationUpdate', (data) => {
      console.log('💬 Conversation update:', data);
      invalidateConversations();
    });

    isInitialized.current = true;

    return () => {
      console.log('🧹 Cleaning up global notifications');
      socket.off('receiveMessage');
      socket.off('messagesSeen');
      socket.off('conversationUpdate');
      isInitialized.current = false;
    };
  }, [userId, role]);

  const handleNewMessage = (message) => {
    // Show browser notification if app is not focused
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('New Message', {
        body: `${message.sender_name || 'Someone'}: ${message.message_text || 'Sent you a message'}`,
        icon: '/favicon.ico', // Add your app icon
        tag: `message-${message.conversation_id}`,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Message'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        // Navigate to the conversation
        window.location.href = `/${role}/message?conversation=${message.conversation_id}`;
      };
    }

    // Add to notifications list
    setNotifications(prev => [
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message,
        timestamp: new Date(),
        read: false
      },
      ...prev.slice(0, 9) // Keep only last 10 notifications
    ]);

    // Update unread counts
    updateUnreadCounts({ conversation_id: message.conversation_id });
    
    // Invalidate queries for real-time updates
    invalidateQueries(message.conversation_id);
  };

  const updateUnreadCounts = (data) => {
    setUnreadCounts(prev => ({
      ...prev,
      [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
    }));
  };

  const invalidateQueries = (conversationId) => {
    // Invalidate message queries
    queryClient.invalidateQueries({
      queryKey: ['messages', role, conversationId]
    });
    
    // Invalidate conversations list
    queryClient.invalidateQueries({
      queryKey: ['conversations', role]
    });
  };

  const invalidateConversations = () => {
    queryClient.invalidateQueries({
      queryKey: ['conversations', role]
    });
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const clearUnreadCount = (conversationId) => {
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[conversationId];
      return newCounts;
    });
  };

  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  };

  return {
    notifications,
    unreadCounts,
    totalUnreadCount: getTotalUnreadCount(),
    markNotificationAsRead,
    clearUnreadCount
  };
};
