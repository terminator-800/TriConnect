import { useEffect } from 'react';
import { useRejectJobPost } from '../../../../../hooks/useRejectJobPost';

const RejectJobPost = ({ jobPost, onClose }) => {
  
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const rejectJobPostMutation = useRejectJobPost();

  const handleReject = () => {
    rejectJobPostMutation.mutate(jobPost.job_post_id, {
      onSuccess: () => {
        onClose(); 
      },
      onError: (error) => {
        console.error('Reject failed:', error);
      },
    });
  };


  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-red-600 text-center">Reject Job Post</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to reject this jobpost? This action cannot be undone.
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
            onClick={handleReject}
            disabled={rejectJobPostMutation.isLoading}
            className="px-5 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 cursor-pointer"
          >
            {rejectJobPostMutation.isLoading ? 'Rejecting...' : 'Yes, Reject'}
          </button>
          <button
            onClick={onClose}
            disabled={rejectJobPostMutation.isLoading}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectJobPost;
