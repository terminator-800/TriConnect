import { useUnappliedJobPosts } from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Pagination from '../../../../components/Pagination';
import icons from '../../../../assets/svg/Icons';
import Apply from './Apply';

const BrowseJob = () => {
    const unknown = 'Unknown';
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: filteredJobPosts = [],
        isLoading: loadingJobPosts,
        isError: errorJobPosts,
    } = useUnappliedJobPosts(ROLE.MANPOWER_PROVIDER);


    //   Pagination
    const postsPerPage = 4;
    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredJobPosts.slice(
        startIndex,
        startIndex + postsPerPage
    );

    return (
        <>
            <h1 className="text-5xl font-bold text-blue-900">Browse Job</h1>
            <p className="text-2xl mt-2">
                Browse job openings and apply to positions that fit you
            </p>

            <div className="rounded-xl w-2xl bg-white pt-2 pb-2 pl-5 pr-5 shadow-md flex justify-between items-center mt-15">
                <input
                    type="text"
                    placeholder="Search job titles"
                    className="outline-none"
                />
                <button className="text-white bg-blue-900 rounded-xl pt-1 pb-1 pr-5 pl-5 cursor-pointer">
                    Find jobs
                </button>
            </div>

            <div className="flex gap-3 mt-15">
                <div className="w-1/2 rounded overflow-y-auto space-y-5">
                    {loadingJobPosts ? (
                        <p>Loading jobs...</p>
                    ) : errorJobPosts ? (
                        <p className="text-red-500">Failed to fetch job posts.</p>
                    ) : filteredJobPosts.length === 0 ? (
                        <p className="text-gray-500 italic">
                            No approved job posts available.
                        </p>
                    ) : (
                        paginatedPosts.map((post) => (
                            <div
                                key={post.job_post_id}
                                onClick={() => setSelectedJobPost(post)}
                                className={`border border-gray-300 rounded-xl py-5 px-5 shadow-md cursor-pointer h-[23.3vh] max-h-[23.3vh] overflow-hidden
                                        ${selectedJobPost?.job_post_id === post.job_post_id ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}                            >
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold truncate">
                                        {post.job_title}
                                    </h3>
                                    <p className="text-gray-500 truncate">
                                        {post.business_name ||
                                            post.full_name ||
                                            post.agency_name ||
                                            unknown}
                                    </p>
                                </div>

                                <span className="bg-blue-200 rounded-xl px-5 py-1 text-blue-700">
                                    {post.job_type}
                                </span>

                                <div className="flex justify-between items-center mt-10">
                                    <div className="flex space-x-1">
                                        <img src={icons.location} alt="Location" />
                                        <p className="text-gray-500 truncate">{post.location}</p>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-3 truncate">
                                        Posted: {post.approved_at}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="w-full bg-gray-200 border border-gray-300 py-5 px-7 rounded-xl overflow-y-auto h-[100vh]">
                    {selectedJobPost ? (
                        <>
                            <div className="flex gap-10 mb-10 mt-5 items-center">
                                <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                                    PHOTO
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold mb-3">
                                        {selectedJobPost.job_title}
                                    </h2>
                                    <p className="text-gray-700 mb-1">
                                        {selectedJobPost.business_name ||
                                            selectedJobPost.full_name ||
                                            selectedJobPost.agency_name ||
                                            unknown}
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
                                        <strong>Location:</strong> {selectedJobPost.location}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Salary:</strong> {selectedJobPost.salary_range}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>{selectedJobPost.job_type}</strong>
                                    </p>
                                </div>

                                <div className="py-3 flex flex-col gap-2">
                                    <span className="text-gray-700">
                                        <strong>Name:</strong>{' '}
                                        {selectedJobPost.authorized_person ||
                                            selectedJobPost.agency_authorized_person ||
                                            selectedJobPost.full_name ||
                                            unknown}
                                    </span>
                                    <span className="text-gray-700">
                                        <strong>Posted:</strong>{' '}
                                        {selectedJobPost.approved_at}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col border-gray-300 border-b-2 py-2 mb-15 gap-2">
                                <span>
                                    <strong>Job Description</strong>
                                </span>
                                <span className="text-gray-700 break-words whitespace-pre-wrap w-full">
                                    {selectedJobPost.job_description}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-1">
                                <strong>Required Skill:</strong>{' '}
                                {selectedJobPost.required_skill}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500 italic">
                            Click a job post to view details
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-15 justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredJobPosts.length / postsPerPage)}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {isModalOpen && selectedJobPost && (
                <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
                    <Apply
                        employer={selectedJobPost}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedJobPost(null);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default BrowseJob;
