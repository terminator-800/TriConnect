import { useEffect, useState } from 'react'
import jobPostApi from '../../../../api/jobPostApi'
import userApi from '../../../../api/userApi';
import icons from '../../../assets/svg/Icons';
import Apply from './Apply';

const BrowseJob = () => {
    const [approvedJobPosts, setApprovedJobPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 4;
    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = approvedJobPosts.slice(startIndex, startIndex + postsPerPage);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchJobPosts = async () => {
        try {
            const jobposts = await jobPostApi.fetchAllJobPost();
            const allUsers = await userApi.fetchUsers();

            const verifiedJobPosts = jobposts.filter(
                (post) => post.status === 'approved' && post.is_verified_jobpost === 1
            );

            setApprovedJobPosts(verifiedJobPosts);
            setUsers(allUsers);
        } catch (err) {
            console.error('Error fetching job posts:', err);
        }
    };

    useEffect(() => {
        
        fetchJobPosts();
    }, []);

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diff = now - past;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
        return `${years} year${years > 1 ? 's' : ''} ago`;
    };

    return (
        <>
            <h1 className="text-5xl font-bold text-blue-900">Browse Job</h1>
            <p className="text-2xl mt-2">Browse job openings and apply to positions that fit you</p>

            <div className="rounded-xl w-2xl bg-white pt-2 pb-2 pl-5 pr-5 shadow-md flex justify-between items-center mt-15">
                <input type="text" placeholder="Search job titles" className="outline-none" />
                <button className="text-white bg-blue-900 rounded-xl pt-1 pb-1 pr-5 pl-5 cursor-pointer">Find jobs</button>
            </div>

            <div className="flex gap-3 mt-15">
                <div className="w-1/2 rounded overflow-y-auto space-y-5">
                    {approvedJobPosts.length === 0 ? (
                        <p className="text-gray-500">No approved job posts available.</p>
                    ) : (
                        paginatedPosts.map((post) => {
                            const user = users.find(u => u.user_id === post.user_id);
                            return (
                                <div
                                    key={post.job_post_id}
                                    onClick={() => setSelectedJobPost({ post, user })}
                                    className="border border-gray-300 rounded-xl py-5 px-5 shadow-md bg-white cursor-pointer hover:bg-gray-50 h-[23.3vh] max-h-[23.3vh] overflow-hidden"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold truncate">{post.job_title}</h3>
                                        <p className="text-gray-500 truncate">
                                            {user?.business_name || user?.full_name || user?.agency_name || 'Unknown'}
                                        </p>
                                    </div>

                                    <span className="bg-blue-200 rounded-xl px-5 py-1 text-blue-700">{post.job_type}</span>

                                    <div className="flex justify-between items-center mt-10">
                                        <div className="flex space-x-1">
                                            <img src={icons.location} alt="Location" />
                                            <p className="text-gray-500 truncate">{post.location}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 ml-3 truncate">
                                            Posted: {getRelativeTime(post.approved_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right side: job detail */}
                <div className="w-full bg-white border border-gray-300 py-5 px-7 rounded-xl overflow-y-auto h-[100vh]">
                    {selectedJobPost ? (
                        <>
                            <div className="flex gap-10 mb-10 mt-5 items-center">
                                <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                                    PHOTO
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold mb-3">{selectedJobPost.post.job_title}</h2>
                                    <p className="text-gray-700 mb-1">
                                        <strong></strong>{' '}
                                        {selectedJobPost.user?.business_name || selectedJobPost.user?.full_name || selectedJobPost.user?.agency_name || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-900 text-white px-10 py-1 rounded-lg cursor-pointer"
                            >
                                Apply Job
                            </button>

                            <div className="flex font-bold justify-between mt-15 pr-60">
                                <h1>Job Details</h1>
                                <h1>Contact Person</h1>
                            </div>

                            <div className="border-y-2 border-gray-300 flex justify-between pr-30">
                                <div className="flex flex-col gap-3 py-3">
                                    <p className="text-gray-700">
                                        <strong>Location:</strong> {selectedJobPost.post.location}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Salary:</strong> {selectedJobPost.post.salary_range}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>{selectedJobPost.post.job_type}</strong>
                                    </p>
                                </div>

                                <div className="py-3 flex flex-col gap-2">
                                    <span className="text-gray-700">
                                        <strong>Name:</strong>{' '}
                                        {
                                            selectedJobPost.user?.authorized_person ||
                                            selectedJobPost.user?.agency_authorized_person ||
                                            selectedJobPost.user?.full_name || 'Unknown'
                                        }
                                    </span>
                                    <span className="text-gray-700">
                                        <strong>Posted: </strong> {getRelativeTime(selectedJobPost.post.approved_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col border-gray-300 border-b-2 py-2 mb-15 gap-2">
                                <span><strong>Job Description</strong></span>
                                <span className="text-gray-700">{selectedJobPost.post.job_description}</span>
                            </div>

                            <p className="text-gray-700 mb-1">
                                <strong>Required Skill:</strong> {selectedJobPost.post.required_skill}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500 italic">Click a job post to view details</p>
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2 mt-5 justify-center">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-700 cursor-pointer'}`}
                >
                    ◀
                </button>

                {(() => {
                    const totalPages = Math.ceil(approvedJobPosts.length / postsPerPage);
                    let start = Math.max(1, currentPage - 1);
                    let end = Math.min(start + 2, totalPages);

                    if (end - start < 2 && start > 1) {
                        start = Math.max(1, end - 2);
                    }

                    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-1 rounded ${pageNumber === currentPage ? 'bg-blue-700 text-white cursor-pointer' : 'bg-gray-200 text-gray-700 cursor-pointer'}`}
                        >
                            {pageNumber}
                        </button>
                    ));
                })()}

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(approvedJobPosts.length / postsPerPage)))}
                    disabled={currentPage === Math.ceil(approvedJobPosts.length / postsPerPage)}
                    className={`px-3 py-1 rounded ${currentPage === Math.ceil(approvedJobPosts.length / postsPerPage)
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-blue-700 cursor-pointer'}`}
                >
                    ▶
                </button>
            </div>

            {isModalOpen && selectedJobPost && (
                <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
                    <Apply
                        jobPost={{
                            job_post_id: selectedJobPost.post.job_post_id,
                            
                        }}
                        employer={selectedJobPost.user}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            )}
        </>
    );
};

export default BrowseJob;
