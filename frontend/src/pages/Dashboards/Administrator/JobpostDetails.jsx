import { useEffect } from 'react';
import { ROLE } from '../../../../utils/role';

const JobpostDetails = ({ jobPost, onClose }) => {
    if (!jobPost) return null;

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const getSubmitterName = () => {
        if (jobPost.role === ROLE.BUSINESS_EMPLOYER) return jobPost.authorized_person || 'Unknown Business';
        if (jobPost.role === ROLE.INDIVIDUAL_EMPLOYER) return jobPost.full_name || 'Unknown Individual';
        if (jobPost.role === ROLE.MANPOWER_PROVIDER) return jobPost.agency_authorized_person || 'Unknown Agency';
        return 'Unknown';
    };

    return (
        <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-screen h-[90vh] overflow-y-auto border border-gray-300
            max-[991px]:mx-10
            max-[861px]:mx-10
            max-[426px]:mx-5
            max-[321px]:mx-2
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            ">
                {/* Hide Scrollbar */}
                <style>
                    {`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                        `}
                </style>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-4 text-center">Job Post Details</h2>
                <div className="justify-between my-4 space-y-5">
                    <p><span className='font-semibold'>Title:</span> {jobPost.job_title}</p>
                    <p className="wrap-break-word whitespace-pre-wrap"><span className="font-semibold">Location:</span> {jobPost.location}</p>
                    <p><span className='font-semibold'>Job Type:</span> {jobPost.job_type}</p>
                    <p className="wrap-break-word whitespace-pre-wrap"><span className="font-semibold">Required Skill:</span> {jobPost.required_skill}</p>
                    <p><span className='font-semibold'>Salary:</span> {jobPost.salary_range}</p>
                    <p>
                        <span className='font-semibold'>Verified:</span>{' '}
                        {jobPost.created_at}
                    </p>
                    <p>
                        <span className='font-semibold'>Submitted by:</span> {getSubmitterName()}
                    </p>
                    <span className='font-semibold'>Description</span>
                    <hr className="mb-4 text-gray-300" />
                    <p className="mt-5 wrap-break-word whitespace-pre-wrap">
                        {jobPost.job_description || 'N/A'}
                    </p>
                </div>
                <hr className="my-4 text-gray-300" />
                <div className="flex items-center gap-x-2">
                    <span className="font-semibold text-lg">Posted By:</span>
                    <p className="italic">{getSubmitterName()}</p>
                </div>

            </div>
        </div>
    );
};

export default JobpostDetails;
