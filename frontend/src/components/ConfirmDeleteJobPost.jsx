import { useDeleteJobPost } from '../../hooks/useDeleteJobPost';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ConfirmDeleteJobPost = ({ onClose, data, role }) => {
  if (!data) return null;

  const { deleteJobPost, isLoading } = useDeleteJobPost(role);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteJobPost(data.job_post_id);
      onClose();
    } catch (err) {
      alert('Failed to delete job post. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-red-600">Delete Job Post</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to <strong>delete</strong> this job post?
        </p>

        <div className="mb-4 text-sm text-gray-800 border border-gray-300 p-4 rounded-lg bg-gray-50">
          <p><strong>Job Title:</strong> {data.job_title}</p>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>Salary:</strong> {data.salary_range}</p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteJobPost.propTypes = {
  onClose: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  data: PropTypes.shape({
    jobPostId: PropTypes.number.isRequired,
    job_title: PropTypes.string,
    location: PropTypes.string,
    salary_range: PropTypes.string,
  }),
};

export default ConfirmDeleteJobPost;
