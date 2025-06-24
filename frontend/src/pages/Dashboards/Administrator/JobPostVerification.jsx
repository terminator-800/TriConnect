import { useState } from 'react';
import { useAllUsers } from '../../../../hooks/useUserProfiles';
import { useJobPosts } from '../../../../hooks/useJobposts';
import ApprovedJobPost from './ApprovedJobPost';
import RejectJobPost from './RejectJobPost';
import JobpostDetails from './JobpostDetails';
import Sidebar from './Sidebar';

const JobPostVerification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [jobPostToReject, setJobPostToReject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [jobPostDetails, setJobPostDetails] = useState(null);
  const [jobPostUser, setJobPostUser] = useState(null);

  const postsPerPage = 3;

  // ✅ React Query hooks
  const { data: jobPosts = [], refetch: refetchJobPosts } = useJobPosts();
  const { data: users = [] } = useAllUsers();

  // ✅ Filter pending only
  const pendingJobPosts = jobPosts.filter((post) => post.status === 'pending');

  // ✅ Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = pendingJobPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(pendingJobPosts.length / postsPerPage);

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

        <h1 className="text-5xl font-bold text-blue-900">Job Post Verification</h1>
        <p className="text-2xl mt-2">Review and verify job posts to allow platform publication</p>

        <div className="w-full rounded mt-10">
          {pendingJobPosts.length === 0 ? (
            <p className="text-gray-500 italic text-lg">No pending job posts.</p>
          ) : (
            <div className="flex flex-col space-y-10">
              {currentPosts.map((post) => {
                const user = users.find((u) => u.user_id === post.user_id);

                return (
                  <div
                    key={post.job_post_id}
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-300 mb-5"
                  >
                    <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-semibold">{post.job_title}</h2>

                        {user?.role === "business_employer" && user.business_name && (
                          <p className="text-gray-500 font-medium">
                            Business Name: {user.business_name}
                          </p>
                        )}

                        {user?.role === "individual_employer" && user.full_name && (
                          <p className="text-gray-500 font-medium">
                            Individual Employer: {user.full_name}
                          </p>
                        )}

                        {user?.role === "manpower_provider" && user.agency_name && (
                          <p className="text-gray-500 font-medium">
                            Agency: {user.agency_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-gray-500 font-medium">
                          Submitted: {formatDateTime(post.submitted_at)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-gray-500 font-medium">Location: {post.location}</p>

                    <div className="flex gap-10 flex-wrap my-5">
                      <p className="text-gray-500 font-medium">Job type: {post.job_type}</p>
                      <p className="text-gray-500 font-medium">Salary: {post.salary_range}</p>
                      <p className="text-gray-500 font-medium">Required Skill: {post.required_skill}</p>
                    </div>

                    <div className="flex space-x-10">
                      <button
                        onClick={() => {
                          setSelectedJobPost(post);
                          setShowModal(true);
                        }}
                        className="bg-green-700 text-white px-10 rounded-md py-1 cursor-pointer hover:bg-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setJobPostToReject(post);
                          setShowRejectModal(true);
                        }}
                        className="bg-red-700 text-white px-10 rounded-md py-1 cursor-pointer hover:bg-red-600"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => {
                          setJobPostDetails(post);
                          setJobPostUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="px-10 border bg-gray-300 hover:bg-gray-400 border-gray-300 rounded-md cursor-pointer py-1"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2 p-15">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Approved */}
          {showModal && selectedJobPost && (
            <ApprovedJobPost
              jobPost={selectedJobPost}
              users={users}
              onApproved={() => {
                refetchJobPosts(); // ✅ React Query refetch
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* Reject */}
          {showRejectModal && jobPostToReject && (
            <RejectJobPost
              jobPost={jobPostToReject}
              users={users}
              onRejected={() => {
                refetchJobPosts(); // ✅ React Query refetch
                setShowRejectModal(false);
              }}
              onClose={() => setShowRejectModal(false)}
            />
          )}

          {/* Jobpost Details */}
          {showDetailsModal && jobPostDetails && jobPostUser && (
            <JobpostDetails
              jobPost={jobPostDetails}
              user={jobPostUser}
              onClose={() => setShowDetailsModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default JobPostVerification;
