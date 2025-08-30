import { useRejectApplication } from '../../../../../hooks/useRejectApplication';

const RejectApplicant = ({ application, onClose }) => {
  const rejectMutation = useRejectApplication();

  const handleReject = () => {
    if (!application?.application_id) return;
    rejectMutation.mutate(
      { applicationId: application.application_id },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <h2 className="text-xl font-bold mb-4 text-red-600">Reject Applicant</h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to reject this applicant? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300"
            onClick={onClose}
            disabled={rejectMutation.isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
            onClick={handleReject}
            disabled={rejectMutation.isLoading}
          >
            {rejectMutation.isLoading ? 'Rejecting...' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectApplicant;


