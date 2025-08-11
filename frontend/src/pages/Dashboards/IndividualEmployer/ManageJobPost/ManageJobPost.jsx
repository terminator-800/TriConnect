import { useState, useReducer } from 'react';
import { modalReducer, initialState } from './reducer';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useJobPostsByUser } from '../../../../../hooks/useJobposts';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../../../Dashboards/IndividualEmployer/Verification Form/VerificationStatus';
import ConfirmStatusChange from '../../../../components/ConfirmStatusChange';
import ConfirmDeleteJobPost from '../../../../components/ConfirmDeleteJobPost';
import Sidebar from '../Sidebar';
import Form from '../../../Dashboards/IndividualEmployer/Verification Form/Form';
import JobTable from './JobTable';

const ManageJobPost = () => {
    const [showForm, setShowForm] = useState(false);
    const [state, dispatch] = useReducer(modalReducer, initialState);

    const { data: employer, isLoading: isEmployerLoading, isError, error, refetch } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);
    const { data: jobPostsGrouped = { pending: [], active: [], completed: [] }, isLoading: isJobsLoading } = useJobPostsByUser();

    const openForm = () => {
        document.body.style.overflow = 'hidden';
        setShowForm(true);
    };

    const handleDeleteClick = (job) => dispatch({ type: 'OPEN_DELETE_MODAL', payload: job });
    const closeDeleteModal = () => dispatch({ type: 'CLOSE_DELETE_MODAL' });

    const openStatusConfirmModal = ({ jobPostId, status, job }) => {
        dispatch({
            type: 'OPEN_STATUS_MODAL',
            payload: {
                jobPostId,
                status,
                job_title: job.job_title,
                location: job.location,
                salary_range: job.salary_range,
            },
        });
    };

    const closeStatusModal = () => dispatch({ type: 'CLOSE_STATUS_MODAL' });

    if (isEmployerLoading || isJobsLoading) return <div className="p-10">Loading...</div>;
    if (isError || !employer) return <div className="p-10 text-red-600">Error: {error?.message}</div>;

    return (
        <>
            <Sidebar />
            <div className="relative min-h-[140vh] bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50 p-10">
                {employer.is_verified ? (
                    <>
                        <header>
                            <h1 className="text-5xl font-bold text-blue-900">Manage Job Post</h1>
                            <p className="text-2xl mt-2">View and manage all your job postings</p>
                            <p className="text-md text-gray-700 mt-1">Welcome, {employer.full_name}</p>
                        </header>

                        {['pending', 'active', 'completed'].map((key) => (
                            <JobTable
                                key={key}
                                title={`${key[0].toUpperCase()}${key.slice(1)} Job Post`}
                                jobs={jobPostsGrouped[key]}
                                onStatusChange={openStatusConfirmModal}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </>
                ) : (
                    <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
                        <VerificationStatus profileData={employer} openForm={openForm} />
                        <p className="mt-4 text-sm text-gray-600">
                            {employer.is_rejected
                                ? 'Your verification request was rejected.'
                                : employer.is_submitted
                                    ? 'Your verification is under review.'
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

            {state.showDeleteModal && (
                <ConfirmDeleteJobPost
                    data={state.deleteTargetJob}
                    onClose={closeDeleteModal}
                    role={ROLE.INDIVIDUAL_EMPLOYER}
                />
            )}

            {state.showStatusModal && (
                <ConfirmStatusChange
                    data={state.statusChangeData}
                    onClose={closeStatusModal}
                    role={ROLE.INDIVIDUAL_EMPLOYER}
                />
            )}
        </>
    );
};

export default ManageJobPost;
