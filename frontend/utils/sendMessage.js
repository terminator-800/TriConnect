import axios from 'axios';
import socket from '../utils/socket';

const API = import.meta.env.VITE_API_URL;

// utils/sendMessage.js
export const sendMessage = async (conversation_id, messageData) => {
  const formData = new FormData();
  formData.append('conversation_id', conversation_id);
  formData.append('sender_id', messageData.sender_id);
  formData.append('receiver_id', messageData.receiver_id);
  formData.append('message_text', messageData.message_text || '');
  if (messageData.file) formData.append('image', messageData.file);

  const response = await axios.post(`${API}/messages/send`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const newMessage = response.data.data;
  socket.emit('sendMessage', newMessage);
  return newMessage;
};

