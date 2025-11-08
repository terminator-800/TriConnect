import { usePendingJobPosts } from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import ApprovedJobPost from './ApprovedJobPost';
import JobpostDetails from '../JobpostDetails';
import RejectJobPost from './RejectJobPost';
import Pagination from '../../../../components/Pagination';
import Sidebar from '../Sidebar';

const JobPostVerification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [jobPostToReject, setJobPostToReject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [jobPostDetails, setJobPostDetails] = useState(null);

  const { data: pendingJobPosts = [] } = usePendingJobPosts(ROLE.ADMINISTRATOR);

  const postsPerPage = 3;
  const totalPages = Math.ceil(pendingJobPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = pendingJobPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-cyan-400 
            2xl:pl-110
            2xl:pr-50
            lg:pl-70
            lg:pr-10
            md:pl-15
            md:pr-15
            max-[769px]:px-10
             pt-50
             ">

        <div>
          <h1 className="text-2xl font-bold text-blue-900">Job Post Verification</h1>
          <p className="mt-2">Review and verify job posts to allow platform publication</p>
        </div>

        <div className="flex-1 mt-10 overflow-y-auto">
          {pendingJobPosts.length === 0 ? (
            <p className="text-gray-500 italic text-lg">No pending job posts.</p>
          ) : (
            <div className="flex flex-col space-y-10 overflow-x-auto ">
              {currentPosts.map((post) => (
                <div
                  key={post.job_post_id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-300 mb-5 
                 min-w-[800px] 
                 max-[768px]:min-w-[600px] 
                 max-[425px]:min-w-1 
                 whitespace-nowrap"
                >
                  {/* Header */}
                  <div className="border-b border-gray-300 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold">{post.job_title}</h2>
                      <p className="text-gray-500 font-medium truncate">
                        {post.role === ROLE.BUSINESS_EMPLOYER && `Business Name: ${post.authorized_person}`}
                        {post.role === ROLE.INDIVIDUAL_EMPLOYER && `Individual Employer: ${post.full_name}`}
                        {post.role === ROLE.MANPOWER_PROVIDER && `Agency: ${post.agency_authorized_person}`}
                      </p>
                    </div>

                    <div className="text-sm sm:text-base text-gray-500 font-medium">
                      Submitted at: {post.created_at}
                    </div>
                  </div>

                  {/* Location */}
                  <p className="mt-5 text-gray-500 font-medium truncate">Location: {post.location}</p>

                  {/* Job Details */}
                  <div className="flex flex-wrap gap-x-10 gap-y-2 my-5">
                    <p className="text-gray-500 font-medium truncate">Job type: {post.job_type}</p>
                    <p className="text-gray-500 font-medium truncate">Salary: {post.salary_range}</p>
                    <p className="text-gray-500 font-medium truncate">Required Skill: {post.required_skill}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 sm:gap-10 mt-3">
                    <button
                      onClick={() => {
                        setSelectedJobPost(post);
                        setShowModal(true);
                      }}
                      className="bg-green-700 text-white px-6 sm:px-10 rounded-md py-1 cursor-pointer hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setJobPostToReject(post);
                        setShowRejectModal(true);
                      }}
                      className="bg-red-700 text-white px-6 sm:px-10 rounded-md py-1 cursor-pointer hover:bg-red-600"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        setJobPostDetails(post);
                        setShowDetailsModal(true);
                      }}
                      className="px-6 sm:px-10 border bg-gray-300 hover:bg-gray-400 border-gray-300 rounded-md cursor-pointer py-1"
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
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        )}

        {showRejectModal && jobPostToReject && (
          <RejectJobPost
            jobPost={jobPostToReject}
            onRejected={() => {
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
