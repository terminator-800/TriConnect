import { useVerifiedJobPosts } from '../../../../hooks/useJobposts'
import { ROLE, ROLE_LABELS } from '../../../../utils/role'
import { useState } from 'react'
import JobpostDetails from './JobpostDetails'
import Pagination from '../../../components/Pagination'
import Sidebar from './Sidebar'
import icons from '../../../assets/svg/Icons'

const VerifiedJobPost = () => {
  const { data: verifiedJobPosts = [], isLoading, isError } = useVerifiedJobPosts();
  
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJobPost, setSelectedJobPost] = useState(null)

  const postsPerPage = 3
  const totalPages = Math.ceil(verifiedJobPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = verifiedJobPosts.slice(indexOfFirstPost, indexOfLastPost)

  if (isLoading) return <div>Loading job posts...</div>
  if (isError) return <div>Error loading job posts.</div>

  const handleViewDetails = (job) => {
    setSelectedJobPost(job)
  }

  const handleCloseDetails = () => {
    setSelectedJobPost(null)
  }

  // Map role to text color
  const getRoleColor = (role) => {
    switch (role) {
      case ROLE.BUSINESS_EMPLOYER:
        return 'text-green-600'
      case ROLE.INDIVIDUAL_EMPLOYER:
        return 'text-yellow-500'
      case ROLE.MANPOWER_PROVIDER:
        return 'text-orange-500'
      case ROLE.JOBSEEKER:
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

        <div>
          <h1 className="text-5xl font-bold text-blue-900">Verified Job Post</h1>
          <p className="text-2xl mt-2">View all job posts approved for publication</p>
        </div>

        <div className="flex-1 mt-10 overflow-y-auto">
          {verifiedJobPosts.length === 0 ? (
            <p className="text-gray-500 italic text-lg">No verified job posts available.</p>
          ) : (
            <div className="flex flex-col space-y-6">
              {currentPosts.map((job) => (
                <div
                  key={job.job_post_id}
                  className="bg-white rounded-lg shadow-md p-6 flex justify-between border border-gray-300"
                  style={{ minHeight: '140px' }}
                >
                  {/* Left side info */}
                  <div>
                    <h2 className="text-2xl font-bold text-black">{job.job_title}</h2>
                    <p className={`text-sm font-bold italic flex items-center gap-2 ${getRoleColor(job.role)}`}>
                      {ROLE_LABELS[job.role] || job.role}
                      <span className="mx-1 text-gray-500">|</span>
                      <span role="img" aria-label="location">
                        <img src={icons.location} alt="location" className="w-6" />
                      </span>
                      <span className="text-gray-600">{job.location}</span>
                    </p>

                    <button
                      onClick={() => handleViewDetails(job)}
                      className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer text-sm hover:bg-gray-300"
                    >
                      View Job Post
                    </button>
                  </div>

                  {/* Right side (Verified info) */}
                  <div className="flex flex-col justify-between items-end">
                    <span className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-full font-medium flex items-center">
                      <img src={icons.verified_check} alt="verified" className="w-6" /> Verified
                    </span>
                    <span className="text-gray-500">
                      Verified on {job.approved_at} at{' '}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 mb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Modal for JobpostDetails */}
        {selectedJobPost && (
          <JobpostDetails
            jobPost={selectedJobPost}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </>
  )
}

export default VerifiedJobPost
