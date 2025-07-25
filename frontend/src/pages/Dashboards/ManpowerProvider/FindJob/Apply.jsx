import { useState, useEffect } from 'react';
import { useManpowerProviderProfile } from '../../../../../hooks/useUserProfiles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import icons from '../../../../assets/svg/Icons';
import socket from '../../../../../utils/socket';

const Apply = ({ jobPost, employer, onClose }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

   const queryClient = useQueryClient();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError: profileError,
  } = useManpowerProviderProfile();

  const mutation = useMutation({
    mutationFn: async ({ job_post_id, sender_id, receiver_id, message, file }) => {
      const user_small_id = Math.min(sender_id, receiver_id);
      const user_large_id = Math.max(sender_id, receiver_id);

      const formData = new FormData();
      formData.append("job_post_id", job_post_id);
      formData.append("sender_id", sender_id);
      formData.append("receiver_id", receiver_id);
      formData.append("user_small_id", user_small_id);
      formData.append("user_large_id", user_large_id);
      formData.append("message", message);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/manpower-provider/applications`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(true);
      setMessage('');
      setFile(null);

      socket.emit("sendMessage", {
        sender_id: profileData.user_id,
        receiver_id: employer.user_id,
        message_text: message,
        file_url: data.file_url,
      });

      queryClient.invalidateQueries(['jobApplications', profileData.user_id]);
      queryClient.invalidateQueries(['jobPostsByUser']);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    },
    onError: (error) => {
      console.error('Application failed:', error.response?.data || error.message);
      alert('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!profileData?.user_id || !message.trim()) return;

    const sender_id = profileData.user_id;
    const receiver_id = employer.user_id;

    mutation.mutate({
      job_post_id: jobPost.job_post_id,
      sender_id,
      receiver_id,
      message,
      file,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="bg-gray-300 w-full max-w-2xl py-5 px-10 rounded-xl border border-gray-500 shadow-lg">
      <div className='flex justify-between items-center border-b pb-3 mb-5 border-gray-500'>
        <h2 className="text-xl font-bold">
          Contact {employer.business_name || employer.full_name || employer.agency_name || 'Employer'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-700 text-2xl rounded cursor-pointer"
          disabled={isSubmitting}
        >
          &times;
        </button>
      </div>

      <p className='text-gray-700 mb-1'>Your Message:</p>
      <textarea
        rows="6"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message or proposal to the employer..."
        className="w-full p-3 border border-gray-500 rounded resize-none outline-none"
        disabled={isSubmitting}
      />

      <div className="mb-4 flex flex-col">
        <label className="text-gray-700 font-medium mb-2" htmlFor="resume">
          Attach Documents <span className="text-sm text-gray-500">(Optional)</span>

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
            />
          </div>

          {file && (
            <p className="text-sm text-gray-700 mt-2">
              Selected: <strong>{file.name}</strong>
            </p>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || loadingProfile || !message.trim()}
          className={`px-4 py-2 rounded-xl text-white cursor-pointer ${isSubmitting || loadingProfile
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-900 hover:bg-blue-800'
            }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {success && <p className="text-green-600 mt-3">Message sent successfully!</p>}
      {profileError && <p className="text-red-600 mt-3">Failed to load profile data.</p>}
    </div>
  );
};

export default Apply;
