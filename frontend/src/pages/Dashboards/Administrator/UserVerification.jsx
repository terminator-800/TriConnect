import { useEffect, useState } from 'react';
import { useSubmittedUsers } from '../../../../hooks/useUserProfiles';
import ViewDocument from './ViewDocument';
import Verify from './Verify';
import Reject from './Reject';
import Sidebar from './Sidebar';
import getImagePath from '../../../../utils/getImagePath';

const UserVerification = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);

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

    return (
        <>
            <Sidebar />
            <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
                <h1 className="text-5xl font-bold text-blue-900">User Verification</h1>
                <p className="text-2xl mt-2">
                    Review and verify users to allow platform access
                </p>

                {loading ? (
                    <p className="mt-10 text-lg text-gray-600">Loading users...</p>
                ) : isError ? (
                    <p className="mt-10 text-red-500">{error?.message || 'Error loading users'}</p>
                ) : users.length === 0 ? (
                    <p className="mt-10 text-lg text-gray-500 italic">
                        No users submitted requirements.
                    </p>
                ) : (
                    <div className="mt-10">
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
                                        <td className="px-6 py-4 text-sm font-bold italic text-gray-800">
                                            {user.full_name || user.business_name || user.agency_name || 'N/A'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold italic ${user.role === 'jobseeker' ? 'text-blue-600' :
                                                user.role === 'business_employer' ? 'text-green-600' :
                                                    user.role === 'manpower_provider' ? 'text-orange-500' :
                                                        user.role === 'individual_employer' ? 'text-yellow-500' : 'text-gray-800'
                                            }`}>
                                            {{
                                                jobseeker: 'Jobseeker',
                                                business_employer: 'Business Employer',
                                                individual_employer: 'Individual Employer',
                                                manpower_provider: 'Agency',
                                            }[user.role] || user.role}
                                        </td>
                                        <td className="px-2 py-2 text-lg text-gray-800 w-[300px]">
                                            <div className="grid grid-cols-2 gap-2">
                                                {user.role === 'jobseeker' && (
                                                    <>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.government_id), label: 'Government ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Government ID</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.selfie_with_id), label: 'Selfie with ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Selfie with ID</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.nbi_barangay_clearance), label: 'NBI / Barangay' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">NBI / Barangay</button>
                                                    </>
                                                )}

                                                {user.role === 'business_employer' && (
                                                    <>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.authorized_person_id), label: 'Authorized Person ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Authorized Person ID</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.business_permit_BIR), label: 'BIR Permit' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">BIR Permit</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.DTI), label: 'DTI' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">DTI</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.business_establishment), label: 'Establishment' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Establishment</button>
                                                    </>
                                                )}

                                                {user.role === 'individual_employer' && (
                                                    <>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.government_id), label: 'Government ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Government ID</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.selfie_with_id), label: 'Selfie w/ ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Selfie w/ ID</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.nbi_barangay_clearance), label: 'NBI / Barangay' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">NBI / Barangay</button>
                                                    </>
                                                )}

                                                {user.role === 'manpower_provider' && (
                                                    <>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.dole_registration_number), label: 'DOLE Reg. No.' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">DOLE Reg. No.</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.mayors_permit), label: "Mayor's Permit" })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Mayor's Permit</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.agency_certificate), label: 'Agency Certificate' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Agency Certificate</button>
                                                        <button onClick={() => setPreviewImage({ src: getImagePath(user, user.authorized_person_id), label: 'Authorized Person ID' })} className="bg-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-400 cursor-pointer">Authorized Person ID</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {new Date(user.created_at).toLocaleDateString()}<br />
                                            <span className="text-gray-500 text-xs">{new Date(user.created_at).toLocaleTimeString()}</span>
                                        </td>
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
