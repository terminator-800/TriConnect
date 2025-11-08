import { useApproveJobPost } from '../../../../../hooks/useApproveJobPost';
import { useEffect } from 'react';

const ApprovedJobPost = ({ jobPost, onClose }) => {

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const approveMutation = useApproveJobPost();

  const handleApprove = () => {
    approveMutation.mutate(jobPost.job_post_id, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error('Approval error:', error);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative border border-gray-300
            max-[426px]:mx-5">
              
        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Approve Job Post</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to approve this job post? This action cannot be undone.
        </p>

        <div className="border border-gray-300 p-5 rounded-xl text-gray-600 mb-4">
          <p className="text-sm">
            <strong>Job Title: </strong> {jobPost.job_title}
          </p>

          <div className="text-sm flex gap-1">
            <h3 className="font-medium">
              <strong>Posted by:</strong>
            </h3>
            <p>{jobPost.employer_name}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-600 cursor-pointer"
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? 'Approving...' : 'Yes, Approve'}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 cursor-pointer"
            disabled={approveMutation.isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovedJobPost;
