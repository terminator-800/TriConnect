import { useState } from 'react';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const JobTable = ({ title, jobs, onStatusChange, onDelete }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleToggleMenu = (jobPostId) =>
        setOpenMenuId((prevId) => (prevId === jobPostId ? null : jobPostId));

    return (
        // w-full max-[769px]:min-w-max divide-y divide-gray-200 border border-gray-300 rounded-lg
        // text-left py-3 px-4 whitespace-nowrap text-sm font-semibold text-gray-700
        <div className="mt-10 overflow-hidden overflow-x-auto w-full">
            <h2 className="italic text-xl mb-2">{title}</h2>
            <div className="bg-white shadow text-gray-600 rounded-lg w-full 
            max-[1025px]:min-w-max 
            max-[769px]:min-w-max">
                
                {/* Header */}
                <div className="bg-gray-300 font-semibold flex px-4 py-3 rounded-t border border-gray-300 text-sm">
                    <div className="w-1/4">Job Title</div>
                    <div className="w-1/5">Type</div>
                    <div className="w-1/5">Date Posted</div>
                    <div className="w-1/6">Applicants</div>
                    <div className="w-1/5">Status</div>
                </div>

                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.job_post_id} className="flex justify-between px-4 py-2 border-b border-gray-300 items-center">
                            <div className="w-1/4">{job.job_title}</div>
                            <div className="w-1/5">{job.job_type}</div>
                            <div className="w-1/5">{job.created_at}</div>
                            <div className="w-1/6">{job.applicant_count || '-'}</div>
                            <div className="w-1/5 flex items-center gap-2">
                                {job.jobpost_status === 'pending' ? (
                                    <div className="flex items-center gap-2 border border-gray-500 rounded-full px-4 w-fit">
                                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                        <span className="text-gray-600 text-md font-medium">Pending</span>
                                    </div>
                                ) : (
                                    <StatusDropdown
                                        status={job.jobpost_status}
                                        onChange={(status) =>
                                            onStatusChange({ jobPostId: job.job_post_id, status, job })
                                        }
                                    />
                                )}
                                <ActionMenu
                                    isOpen={openMenuId === job.job_post_id}
                                    onToggle={() => handleToggleMenu(job.job_post_id)}
                                    onDeleteClick={() => onDelete(job)}
                                />
                            </div>
                        </div>
                    ))

                ) : (
                    <div className="px-4 py-6 text-center text-gray-500 italic">No jobs found.</div>
                )}
            </div>
        </div>
    );
};

export default JobTable;
