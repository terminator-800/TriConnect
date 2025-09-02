import { useStatusChange } from '../../hooks/useStatusChange';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ConfirmStatusChange = ({ onClose, data, role }) => {
  if (!data) return null;

  const { changeStatus, isLoading } = useStatusChange(role);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleConfirm = async () => {
    try {
      await changeStatus({
        jobPostId: data.jobPostId,
        status: data.status,
      });
      onClose();
    } catch (err) {
      alert('Failed to change status. Please try again.');
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

        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Change Status</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to change the status to <strong>{data.status}</strong>?
        </p>

        <div className="mb-4 text-sm text-gray-800 border border-gray-300 p-4 rounded-lg bg-gray-50">
          <p><strong>Job Title:</strong> {data.job_title}</p>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>Salary:</strong> {data.salary_range}</p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            {isLoading ? 'Changing...' : 'Yes, Change'}
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

ConfirmStatusChange.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    jobPostId: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    job_title: PropTypes.string,
    location: PropTypes.string,
    salary_range: PropTypes.string,
  }),
  role: PropTypes.string.isRequired, 
};

export default ConfirmStatusChange;
