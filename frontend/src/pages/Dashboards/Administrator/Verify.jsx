import { useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const Verify = ({ onClose, user, onVerified }) => {
  if (!user) return null;

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const roleLabels = {
    jobseeker: 'Jobseeker',
    business_employer: 'Business Employer',
    individual_employer: 'Individual Employer',
    manpower_provider: 'Agency',
  };

  // React Query mutation to verify user
  const verifyMutation = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `http://localhost:3001/admin/verify/user/${user.user_id}`
      );
    },
    onSuccess: () => {
      alert('User verified successfully!');
      if (onVerified) onVerified(); // Refresh user list
      onClose();
    },
    onError: (error) => {
      console.error('Verification failed:', error);
      alert('Something went wrong while verifying the user.');
    },
  });

  const handleVerify = () => {
    verifyMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative border border-gray-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>

        {/* Confirmation Message */}
        <h2 className="text-xl font-bold mb-4 text-center text-blue-900">
          Confirm Verification
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to verify this user? This action cannot be undone.
        </p>

        {/* User Details */}
        <div className="mb-4 text-sm text-gray-800 border border-gray-300 p-4 rounded-lg bg-gray-50">
          <p>
            <strong>Full Name:</strong>{' '}
            {user.full_name || user.business_name || user.agency_name || 'N/A'}
          </p>
          <p>
            <strong>Email:</strong> {user.email || 'N/A'}
          </p>
          <p>
            <strong>Role:</strong> {roleLabels[user.role] || user.role}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleVerify}
            disabled={verifyMutation.isLoading}
            className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            {verifyMutation.isLoading ? 'Verifying...' : 'Yes, Verify'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
