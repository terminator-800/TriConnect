import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import icons from '../src/assets/svg/Icons';
import socket from '../utils/socket';
import { useQueryClient } from '@tanstack/react-query';

const MessageAgency = ({ sender, receiver, role, onClose }) => {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const sender_id = Number(sender?.user_id);
  const receiver_id = Number(receiver?.user_id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ sender_id, receiver_id, message, file }) => {
      const user_small_id = Math.min(sender_id, receiver_id);
      const user_large_id = Math.max(sender_id, receiver_id);

      const formData = new FormData();
      formData.append('agency_profile_id', receiver.user_id);
      formData.append('sender_id', sender_id);
      formData.append('receiver_id', receiver_id);
      formData.append('user_small_id', user_small_id);
      formData.append('user_large_id', user_large_id);
      formData.append('message', message);
      if (file) formData.append('file', file);

      const url = `${import.meta.env.VITE_API_URL}/${role}/message-agency`;
      const { data } = await axios.post(url, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return data;
    },

    onSuccess: (data, vars) => {
      setSuccess(true);
      setMessage('');
      setFile(null);

      socket.emit('sendMessage', {
        sender_id,
        receiver_id,
        message_text: vars.message,
        file_url: data.file_url,
      });

      queryClient.invalidateQueries({
        queryKey: ['unmessaged-agencies', sender_id], 
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    },

    onError: (err) => {
      console.error('Message failed:', err.response?.data || err.message);
      alert('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!sender_id || !message.trim()) return;

    mutation.mutate({
      sender_id,
      receiver_id,
      message,
      file,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="bg-gray-300 w-full max-w-2xl py-5 px-10 rounded-xl border border-gray-500 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-5 border-gray-500">
        <h2 className="text-xl font-bold">
          Message {receiver.agency_name || receiver.business_name || receiver.full_name || 'Agency'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-700 text-2xl rounded cursor-pointer"
          disabled={isSubmitting}
        >
          &times;
        </button>
      </div>

      <p className="text-gray-700 mb-1">Your Message:</p>
      <textarea
        rows="6"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Introduce yourself and explain why you’re interested in this agency."
        className="w-full p-3 border border-gray-500 rounded resize-none outline-none"
        disabled={isSubmitting}
      />

      <div className="mb-4 flex flex-col">
        <label className="text-gray-700 font-medium mb-2" htmlFor="resume">
          Attach Resume/Documents <span className="text-sm text-gray-500">(Optional)</span>
        </label>
        <div className="mt-2">
          <label
            htmlFor="resume"
            className="inline-flex items-center gap-2 border border-blue-500 px-3 py-1 cursor-pointer rounded-xl"
          >
            <img src={icons.pin} alt="Pin" className="w-5 h-5" />
            <span>Attach File</span>
          </label>
          <input
            type="file"
            id="resume"
            name="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={isSubmitting}
          />
          {file && (
            <p className="text-sm text-gray-700 mt-2">
              Selected: <strong>{file.name}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim()}
          className={`px-4 py-2 rounded-xl text-white ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 cursor-pointer'
            }`}
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </div>

      {success && <p className="text-green-600 mt-3">Message sent successfully!</p>}
    </div>
  );
};

export default MessageAgency;
