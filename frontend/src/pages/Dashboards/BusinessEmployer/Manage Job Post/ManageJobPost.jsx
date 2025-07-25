import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ROLE } from '../../../../../utils/role';
import { JOBPOST_STATUS } from '../../../../../utils/JobPostStatus';
import icons from '../../../../assets/svg/Icons';
import Sidebar from '../Sidebar';
import VerificationStatus from '../../../Dashboards/BusinessEmployer/Verification Form/VerificationStatus';
import Form from '../../BusinessEmployer/Verification Form/Form';
import { useBusinessEmployerProfile } from '../../../../../hooks/useUserProfiles';
import { useJobPostsByUser } from '../../../../../hooks/useJobposts';
import { useStatusChange } from '../../../../../hooks/useStatusChange';
import { useDeleteJobPost } from '../../../../../hooks/useDeleteJobPost';
import ConfirmStatusChange from '../../../../components/ConfirmStatusChange';
import ConfirmDeleteJobPost from '../../../../components/ConfirmDeleteJobPost';

const ManageJobPost = () => {
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const queryClient = useQueryClient();

    // Business Profile
    const {
        data: employer,
        isLoading: isEmployerLoading,
        isError,
        error,
        refetch,
    } = useBusinessEmployerProfile();

    // Get Job Posts
    const {
        data: jobPostsGrouped = { pending: [], active: [], completed: [] },
        isLoading: isJobsLoading,
    } = useJobPostsByUser(employer?.user_id, {
        enabled: !!employer?.user_id,
    });
    
    // Confirm Status Change
    const {
        showModal: openStatusConfirmModal,
        ModalUI: ConfirmStatusModal,
    } = ConfirmStatusChange({
        onConfirm: async ({ jobPostId, status }) => {
            try {
                setUpdatingId(jobPostId);
                await changeStatus({ jobPostId, status });
                queryClient.invalidateQueries(['jobPostsByUser', employer?.user_id]);
            } catch (err) {
                console.error('Status update failed', err);
            } finally {
                setUpdatingId(null);
                setSelectedJobPost(null);
            }
        },
    });

    // Confirm Delete Job Post
    const {
        showModal: openDeleteModal,
        ModalUI: ConfirmDeleteModal,
    } = ConfirmDeleteJobPost({
        onConfirm: async (job) => {
            try {
                await deleteJobPost(job.job_post_id);
                queryClient.invalidateQueries(['jobPostsByUser', employer?.user_id]);
            } catch (err) {
                console.error('Failed to delete job post', err);
            }
        },
    });

    const openForm = () => {
        document.body.style.overflow = 'hidden';
        setShowForm(true);
    };

    // Delete Job Post
    const handleDeleteClick = (job) => {
        setSelectedJobPost(job);
        openDeleteModal(job);
    };

    const { changeStatus, isLoading: isChangingStatus, error: statusChangeError } =
        useStatusChange(ROLE.BUSINESS_EMPLOYER);

    const { deleteJobPost, isLoading: isDeleting, error: deleteError } =
        useDeleteJobPost(ROLE.BUSINESS_EMPLOYER);

    if (isEmployerLoading || isJobsLoading) return <div className="p-10">Loading...</div>;
    if (isError || !employer)
        return <div className="p-10 text-red-600">Error: {error?.message || 'Employer not found.'}</div>;

    return (
        <>
            <Sidebar />
            <div className="relative min-h-[140vh] bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50 p-10">
                {employer.is_verified ? (
                    <>
                        <div>
                            <h1 className="text-5xl font-bold text-blue-900">Manage Job Post</h1>
                            <p className="text-2xl mt-2">View and manage all your job postings</p>
                            <p className="text-md text-gray-700 mt-1">Welcome, {employer.full_name}</p>
                        </div>

                        {/* Use grouped job data directly */}
                        <JobTable
                            title="Pending Job Post"
                            jobs={jobPostsGrouped.pending}
                            onStatusChange={openStatusConfirmModal}
                            isChangingStatus={isChangingStatus}
                            updatingId={updatingId}
                            statusChangeError={statusChangeError}
                            onDelete={handleDeleteClick}
                        />

                        <JobTable
                            title="Active Job Post"
                            jobs={jobPostsGrouped.active}
                            onStatusChange={openStatusConfirmModal}
                            isChangingStatus={isChangingStatus}
                            updatingId={updatingId}
                            statusChangeError={statusChangeError}
                            onDelete={handleDeleteClick}
                        />

                        <JobTable
                            title="Completed Job Post"
                            jobs={jobPostsGrouped.completed}
                            onStatusChange={openStatusConfirmModal}
                            isChangingStatus={isChangingStatus}
                            updatingId={updatingId}
                            statusChangeError={statusChangeError}
                            onDelete={handleDeleteClick}
                        />
                    </>
                ) : (
                    <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
                        <VerificationStatus profileData={employer} openForm={openForm} />
                        <p className="mt-4 text-sm text-gray-600">
                            {employer.is_rejected
                                ? 'Your verification request was rejected. Please review and resubmit the form.'
                                : employer.is_submitted
                                    ? 'Your verification is under review. Please wait for approval.'
                                    : 'You need to submit verification before managing job posts.'}
                        </p>
                    </div>
                )}
            </div>

            {showForm && (
                <Form
                    onClose={() => {
                        setShowForm(false);
                        document.body.style.overflow = 'auto';
                    }}
                    onSubmitSuccess={() => {
                        setShowForm(false);
                        document.body.style.overflow = 'auto';
                        refetch();
                    }}
                />
            )}

            <ConfirmDeleteModal/>
            <ConfirmStatusModal/>
        </>
    );
};

const JobTable = ({ title, jobs, onStatusChange, isChangingStatus, updatingId, statusChangeError, onDelete }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleToggleMenu = (jobPostId) => {
        setOpenMenuId(prevId => (prevId === jobPostId ? null : jobPostId));
    };

    return (
        <div className="mt-10">
            <h2 className="italic text-xl mb-2">{title}</h2>
            <div className="bg-white rounded shadow text-gray-600">
                <div className="bg-gray-300 font-semibold flex px-4 py-3 rounded-t border-b border-gray-500">
                    <div className="w-1/4">Job Title</div>
                    <div className="w-1/5">Type</div>
                    <div className="w-1/5">Date Posted</div>
                    <div className="w-1/6">Applicants</div>
                    <div className="w-1/5">Status</div>
                </div>

                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.job_post_id} className="flex justify-between px-4 py-3">
                            <div className="w-1/4">{job.job_title}</div>
                            <div className="w-1/5">{job.job_type}</div>
                            <div className="w-1/5">{format(new Date(job.created_at), 'MMM d, yyyy - hh:mm a')}</div>
                            <div className="w-1/6">{job.applicant_count || '-'}</div>
                            <div className="w-1/5 flex items-center gap-2">
                                {updatingId === job.job_post_id || isChangingStatus ? (
                                    <span className="italic text-sm text-gray-500">Updating...</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {job.status === 'pending' ? (
                                            <>
                                                <div className='flex items-center border border-gray-500 rounded-md bg-gray-200 pl-2 pr-10 gap-3'>
                                                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                                    <span className="text-sm text-gray-700">Pending</span>
                                                </div>
                                                <ActionMenu
                                                    isOpen={openMenuId === job.job_post_id}
                                                    onToggle={() => handleToggleMenu(job.job_post_id)}
                                                    onDeleteClick={() => onDelete(job)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <StatusDropdown
                                                    status={job.jobpost_status}
                                                    onChange={(status) => onStatusChange({ jobPostId: job.job_post_id, status })}
                                                />
                                                <ActionMenu
                                                    isOpen={openMenuId === job.job_post_id}
                                                    onToggle={(value) => setOpenMenuId(value ? job.job_post_id : null)}
                                                    onDeleteClick={() => onDelete(job)}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-6 text-center text-gray-500 italic">No jobs found in this category.</div>
                )}

                {statusChangeError && (
                    <div className="text-red-500 text-sm px-4 py-2">⚠️ Failed to update status.</div>
                )}
            </div>
        </div>
    );
};

const statusColors = {
    active: 'blue',
    paused: 'orange',
    completed: 'red',
};

const StatusDropdown = ({ status, onChange }) => (
    <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 border border-gray-500 rounded-md text-sm cursor-pointer outline-none"
        style={{
            color: statusColors[status?.toLowerCase()] || 'black',
            backgroundColor: `${statusColors[status?.toLowerCase()] || 'gray'}20`,
        }}
    >
        <option value={JOBPOST_STATUS.ACTIVE}>Active</option>
        <option value={JOBPOST_STATUS.PAUSED}>Paused</option>
        <option value={JOBPOST_STATUS.COMPLETED}>Completed</option>
    </select>
);

const ActionMenu = ({ isOpen, onToggle, onDeleteClick }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onToggle(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => onToggle(prev => !prev)}
                className="text-xl px-2 py-1 hover:bg-gray-200 rounded-full focus:outline-none cursor-pointer"
                title="Actions"
            >
                <img src={icons.three_dots} alt="three dots" />
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <ul className="text-sm text-gray-700">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit Job Post</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Details</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Applicants</li>
                        <li
                            onClick={onDeleteClick}
                            className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ManageJobPost;
