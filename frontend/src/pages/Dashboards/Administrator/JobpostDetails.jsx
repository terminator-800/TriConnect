import { useEffect } from 'react';

const JobpostDetails = ({ jobPost, user, onClose }) => {
    if (!jobPost || !user) return null;

    // Prevent background scroll
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-[100vh] overflow-y-auto border border-gray-300">

                {/* ❌ Top-right close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-4 text-center">Job Post Details</h2>
                <div className="justify-between my-4 space-y-5">
                    <p><span className='font-semibold'>Title:</span> {jobPost.job_title}</p>
                    <p><span className='font-semibold'>Location:</span> {jobPost.location}</p>
                    <p><span className='font-semibold'>Job Type:</span> {jobPost.job_type}</p>
                    <p><span className='font-semibold'>Required Skill:</span> {jobPost.required_skill}</p>
                    <p><span className='font-semibold'>Salary:</span> {jobPost.salary_range}</p>
                    <p>
                        <span className='font-semibold'>Submitted:</span>{' '}
                        {new Date(jobPost.submitted_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        })}
                    </p>
                    <p>
                        <span className='font-semibold'>Submitted by:</span>{' '}
                        {user.role === 'business_employer' && user.authorized_person}
                        {user.role === 'individual_employer' && user.full_name}
                        {user.role === 'manpower_provider' && user.agency_authorized_person}
                    </p>
                    <span className='font-semibold'>Description</span>
                    <hr className="mb-4 text-gray-300" />
                    <p className='mt-5'><span className='font-semibold'></span> {jobPost.job_description || 'N/A'}</p>
                </div>
                <hr className="my-4 text-gray-300" />
                <div className="flex items-center gap-x-2">
                    <span className="font-semibold text-lg">Posted By:</span>
                    {user.role === 'business_employer' && <p className='italic'>{user.business_name}</p>}
                    {user.role === 'individual_employer' && <p className='italic'>{user.full_name}</p>}
                    {user.role === 'manpower_provider' && <p className='italic'>{user.agency_name}</p>}
                </div>

            </div>
        </div>
    );
};

export default JobpostDetails;
