import { useEffect } from 'react';
import { ROLE_LABELS } from '../../../../../utils/role';
import { useRejectUser } from '../../../../../hooks/useRejectUser';
import PropTypes from 'prop-types';

const Reject = ({ onClose, user,  }) => {
  if (!user) return null;

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const rejectMutation = useRejectUser(); 

  const handleReject = () => {
    rejectMutation.mutate(user.user_id, {
      onSuccess: () => {
        onClose();
      },
    });
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

        <h2 className="text-xl font-bold mb-4 text-center text-red-700">Reject User</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to reject this user? This action cannot be undone.
        </p>

        <div className="mb-4 text-sm text-gray-800 border border-gray-300 p-4 rounded-lg bg-gray-50">
          <p><strong>Full Name:</strong> {user.full_name || user.business_name || user.agency_name || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Role:</strong> {ROLE_LABELS[user.role] || user.role}</p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleReject}
            disabled={rejectMutation.isLoading}
            className="bg-red-900 hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            {rejectMutation.isLoading ? 'Rejecting...' : 'Yes, Reject'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg cursor-pointer"
            disabled={rejectMutation.isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

Reject.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onRejected: PropTypes.func,
};

export default Reject;
