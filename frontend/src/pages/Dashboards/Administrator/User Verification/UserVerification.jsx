import { useEffect, useState } from 'react';
import { useSubmittedUsers } from '../../../../../hooks/useUserProfiles';
import { ROLE, ROLE_LABELS } from '../../../../../utils/role';
import { format } from 'date-fns';
import ViewDocument from '../ViewDocument';
import Verify from '../User Verification/Verify';
import Reject from '../User Verification/Reject';
import Sidebar from '../Sidebar';
import { documentMap, getImagePath } from '../../../../../utils/getImagePath';
import Pagination from '../../../../components/Pagination';

const ITEMS_PER_PAGE = 5;

const UserVerification = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: users = [],
        isLoading: loading,
        isError,
        error,
        refetch,
    } = useSubmittedUsers();

    useEffect(() => {
        document.body.style.overflow = previewImage ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [previewImage]);

    // Pagination 
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Sidebar />
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
                <h1 className="text-5xl font-bold text-blue-900">User Verification</h1>
                <p className="text-2xl mt-2">
                    Review and verify users to allow platform access
                </p>

                <div className='flex-1'>
                    {loading ? (
                        <p className="mt-10 text-lg text-gray-600">Loading users...</p>
                    ) : isError ? (
                        <p className="mt-10 text-red-500">{error?.message || 'Error loading users'}</p>
                    ) : users.length === 0 ? (
                        <p className="mt-10 text-lg text-gray-500 italic">
                            No users submitted requirements.
                        </p>
                    ) : (
                        <div className="mt-10 flex-1">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
                                <thead className="bg-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User Details</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted Documents</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.user_id}>

                                            {/* Names */}
                                            <td className="px-6 py-4 text-sm font-bold italic text-gray-800">
                                                {user.full_name || user.business_name || user.agency_name || 'N/A'}
                                            </td>

                                            {/* ROLE */}
                                            <td
                                                className={`px-6 py-4 text-sm font-bold italic ${user.role === ROLE.JOBSEEKER ? 'text-blue-600'
                                                    : user.role === ROLE.BUSINESS_EMPLOYER ? 'text-green-500'
                                                        : user.role === ROLE.MANPOWER_PROVIDER ? 'text-orange-500'
                                                            : user.role === ROLE.INDIVIDUAL_EMPLOYER ? 'text-yellow-500'
                                                                : 'text-gray-500'
                                                    }`}
                                            >
                                                {ROLE_LABELS[user.role] || user.role}
                                            </td>

                                            {/* Documents */}
                                            <td className="px-2 py-2 text-lg text-gray-800 w-[300px]">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {documentMap[user.role]?.map(({ key, label }) => (
                                                        <button
                                                            key={key}
                                                            onClick={() =>
                                                                setPreviewImage({ src: getImagePath(user, user[key]), label })
                                                            }
                                                            className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer"
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {format(new Date(user.created_at), 'MMMM d, yyyy')}<br />
                                                <span className="text-gray-500 text-xs">
                                                    {format(new Date(user.created_at), 'h:mm a')}
                                                </span>
                                            </td>

                                            {/* Buttons */}
                                            <td className="px-6 py-4 text-sm text-gray-800 align-middle">
                                                <div className="flex flex-col items-start space-y-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUserId(user.user_id);
                                                                setShowConfirmModal(true);
                                                            }}
                                                            className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUserId(user.user_id);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="border border-red-500 px-3 py-1 rounded cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedUserForModal(user)}
                                                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 cursor-pointer"
                                                    >
                                                        View Documents
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                        </div>
                    )}
                </div>


                {/* Pagination Component */}
                <div className="mt-10 mb-10">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

                {previewImage && (
                    <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50">
                        <div className="relative bg-white p-4 rounded shadow-lg border border-gray-300">
                            <h2 className="text-lg font-semibold mb-2">{previewImage.label}</h2>
                            <img src={previewImage.src} alt={previewImage.label} className="max-w-[80vw] max-h-[80vh] object-contain" />
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-2 right-2 text-2xl px-2 py-1 rounded cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}

                {selectedUserForModal && (
                    <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50">
                        <ViewDocument user={selectedUserForModal} onClose={() => setSelectedUserForModal(null)} />
                    </div>
                )}

                {showConfirmModal && selectedUserId && (
                    <Verify
                        user={users.find((u) => u.user_id === selectedUserId)}
                        onClose={() => setShowConfirmModal(false)}
                        onVerified={refetch}
                    />
                )}

                {showRejectModal && selectedUserId && (
                    <Reject
                        user={users.find((u) => u.user_id === selectedUserId)}
                        onClose={() => setShowRejectModal(false)}
                        onRejected={refetch}
                    />
                )}
            </div>
        </>
    );
};

export default UserVerification;
