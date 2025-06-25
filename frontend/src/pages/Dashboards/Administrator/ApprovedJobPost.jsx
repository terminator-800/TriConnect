import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const ApprovedJobPost = ({ jobPost, users, onApproved, onClose }) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const user = users.find((u) => u.user_id === jobPost.user_id);

    const approveMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/admin/approve/jobpost/${jobPost.job_post_id}`,
                {},
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            alert('Jobpost approved successfully!');
            if (onApproved) onApproved();
            onClose();
        },
        onError: (error) => {
            console.error('Approval failed:', error?.response?.data || error.message);
            alert('Failed to approve the job post.');
        },
    });

    const handleApprove = () => {
        approveMutation.mutate();
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Approve Job Post</h2>
                <p className='text-gray-700 text-center mb-4'>Are you sure you want to approve this jobpost? This action cannot be undone.</p>

                <div className='border border-gray-300 p-5 rounded-xl text-gray-600 mb-4'>
                    <p className="text-sm"><strong>Job Title: </strong> {jobPost.job_title}</p>

                    {/* ✅ Render user details */}
                    <div className="text-sm flex gap-1">
                        <h3 className="font-medium"><strong>Posted by:</strong></h3>
                        {user?.role === "business_employer" && <p>{user.business_name}</p>}
                        {user?.role === "individual_employer" && <p>{user.full_name}</p>}
                        {user?.role === "manpower_provider" && <p>{user.agency_name}</p>}
                        {user?.role === "jobseeker" && <p>{user.full_name}</p>}
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
