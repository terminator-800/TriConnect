import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import icons from '../../../../assets/svg/Icons';
import socket from '../../../../../utils/socket';

const Apply = ({ employer, onClose }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log(employer, 'employer data');
  console.log(employer.job_post_id, 'job post id');
  console.log(employer.user_id, 'employer user id');
  

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ job_post_id, receiver_id, message, files }) => {

      const formData = new FormData();
      formData.append("job_post_id", job_post_id);
      formData.append("receiver_id", receiver_id);
      formData.append("message", message);

      if (files) {
        formData.append("files", files);
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
      setFiles(null);

      socket.emit("sendMessage", {
        receiver_id: employer.user_id,
        message_text: message,
        file_url: data.file_url,
      });

      // queryClient.invalidateQueries(['jobApplications', profileData.user_id]);
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

    if (!message.trim() && !files) {
      alert('Please enter a message or attach a file.');
      return;
    }


    mutation.mutate({
      job_post_id: employer.job_post_id,
      receiver_id: employer.user_id,
      message,
      files: files
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
              onChange={(e) => setFiles(e.target.files[0])}
            />
          </div>

          {files && (
            <p className="text-sm text-gray-700 mt-2">
              Selected: <strong>{files.name}</strong>
            </p>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim()}
          className={`px-4 py-2 rounded-xl text-white cursor-pointer ${isSubmitting
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-900 hover:bg-blue-800'
            }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {success && <p className="text-green-600 mt-3">Message sent successfully!</p>}
    </div>
  );
};

export default Apply;
