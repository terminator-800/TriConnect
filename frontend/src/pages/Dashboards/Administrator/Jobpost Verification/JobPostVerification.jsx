import { useState } from 'react';
import { usePendingJobPosts } from '../../../../../hooks/useJobposts';
import { format } from 'date-fns';
import { ROLE } from '../../../../../utils/role';
import ApprovedJobPost from './ApprovedJobPost';
import RejectJobPost from './RejectJobPost';
import JobpostDetails from '../JobpostDetails';
import Sidebar from '../Sidebar';
import Pagination from '../../../../components/Pagination';

const JobPostVerification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [jobPostToReject, setJobPostToReject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [jobPostDetails, setJobPostDetails] = useState(null);

  const { data: pendingJobPosts = [], refetch: refetchJobPosts } = usePendingJobPosts();
  
  const postsPerPage = 3;
  const totalPages = Math.ceil(pendingJobPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = pendingJobPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

        <div>
          <h1 className="text-5xl font-bold text-blue-900">Job Post Verification</h1>
          <p className="text-2xl mt-2">Review and verify job posts to allow platform publication</p>
        </div>

        <div className="flex-1 mt-10 overflow-y-auto">
          {pendingJobPosts.length === 0 ? (
            <p className="text-gray-500 italic text-lg">No pending job posts.</p>
          ) : (
            <div className="flex flex-col space-y-10">
              {currentPosts.map((post) => (
                <div
                  key={post.job_post_id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-300 mb-5"
                >
                  <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">{post.job_title}</h2>
                      <p className="text-gray-500 font-medium">
                        {post.role === ROLE.BUSINESS_EMPLOYER && `Business Name: ${post.business_name}`}
                        {post.role === ROLE.INDIVIDUAL_EMPLOYER && `Individual Employer: ${post.full_name}`}
                        {post.role === ROLE.MANPOWER_PROVIDER && `Agency: ${post.agency_name}`}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 font-medium">
                        Submitted at: {format(new Date(post.submitted_at), "MMM dd, yyyy h:mm a")}
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
                        setShowDetailsModal(true);
                      }}
                      className="px-10 border bg-gray-300 hover:bg-gray-400 border-gray-300 rounded-md cursor-pointer py-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 mb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {showModal && selectedJobPost && (
          <ApprovedJobPost
            jobPost={selectedJobPost}
            onApproved={() => {
              refetchJobPosts();
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        )}

        {showRejectModal && jobPostToReject && (
          <RejectJobPost
            jobPost={jobPostToReject}
            onRejected={() => {
              refetchJobPosts();
              setShowRejectModal(false);
            }}
            onClose={() => setShowRejectModal(false)}
          />
        )}

        {showDetailsModal && jobPostDetails && (
          <JobpostDetails
            jobPost={jobPostDetails} 
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default JobPostVerification;
