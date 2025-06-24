import { useEffect } from 'react';

const ViewDocument = ({ user, onClose }) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const getImagePath = (user, filename) => {
        if (!filename || !user) return null;

        const role = user.role;
        const user_id = user.user_id;

        const name =
            role === "jobseeker"
                ? user.full_name
                : role === "individual_employer"
                    ? user.full_name
                    : role === "business_employer"
                        ? user.business_name
                        : role === "manpower_provider"
                            ? user.agency_name
                            : "unknown";

        if (!name) return null;

        return `http://localhost:3001/uploads/${role}/${user_id}/${encodeURIComponent(name)}/${filename}`;
    };

    const documentMap = {
        jobseeker: [
            { key: 'government_id', label: 'Government ID' },
            { key: 'selfie_with_id', label: 'Selfie with ID' },
            { key: 'nbi_barangay_clearance', label: 'NBI / Barangay Clearance' },
        ],
        business_employer: [
            { key: 'authorized_person_id', label: 'Authorized Person ID' },
            { key: 'business_permit_BIR', label: 'BIR Permit' },
            { key: 'DTI', label: 'DTI' },
            { key: 'business_establishment', label: 'Establishment' },
        ],
        individual_employer: [
            { key: 'government_id', label: 'Government ID' },
            { key: 'selfie_with_id', label: 'Selfie with ID' },
            { key: 'nbi_barangay_clearance', label: 'NBI / Barangay Clearance' },
        ],
        manpower_provider: [
            { key: 'dole_registration_number', label: 'DOLE Registration No.' },
            { key: 'mayors_permit', label: "Mayor's Permit" },
            { key: 'agency_certificate', label: 'Agency Certificate' },
            { key: 'authorized_person_id', label: 'Authorized Person ID' },
        ],
    };

    // Role-based user detail configuration
    const infoMap = {
        jobseeker: [
            { key: 'full_name', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'gender', label: 'Gender' },
            { key: 'present_address', label: 'Present Address' },
            { key: 'permanent_address', label: 'Permanent Address' },
        ],
        business_employer: [
            { key: 'business_name', label: 'Business Name' },
            { key: 'email', label: 'Email' },
            { key: 'industry', label: 'Industry' },
            { key: 'business_size', label: 'Business Size' },
            { key: 'authorized_person', label: 'Authorized Person' },
            { key: 'business_address', label: 'Business Address' },
        ],
        individual_employer: [
            { key: 'full_name', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'gender', label: 'Gender' },
            { key: 'present_address', label: 'Present Address' },
            { key: 'permanent_address', label: 'Permanent Address' },
        ],
        manpower_provider: [
            { key: 'agency_name', label: 'Agency Name' },
            { key: 'email', label: 'Email' },
            { key: 'agency_address', label: 'Address' },
            { key: 'agency_services', label: 'Services Offered' },
            { key: 'agency_authorize_person', label: 'Authorized Person' },
        ],
    };
    const documentsToShow = documentMap[user?.role] || [];
    const infoToShow = infoMap[user?.role] || [];
    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full h-[85vh] overflow-y-auto relative border border-gray-300 hide-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">User Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    {infoToShow.map(({ key, label }) => (
                        <div key={key}>
                            <span className="font-semibold">{label}:</span> {user[key] || 'N/A'}
                        </div>
                    ))}
                </div>
                <hr className="my-4" />
                <h2 className="text-2xl font-bold mb-4 text-center">Submitted Documents</h2>
                {documentsToShow.length === 0 ? (
                    <p className="text-center text-gray-500">No documents available for this user.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {documentsToShow.map(({ key, label }) => {
                            const fileUrl = getImagePath(user, user[key]);
                            return fileUrl ? (
                                <div key={key} className="flex flex-col items-center">
                                    <p className="text-sm font-semibold mb-1">{label}</p>
                                    <img
                                        src={fileUrl}
                                        alt={label}
                                        className="w-full max-h-[400px] object-contain rounded border border-gray-300 shadow"
                                    />
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-xs mt-1 underline"
                                    >
                                        View Full
                                    </a>
                                </div>
                            ) : (
                                <div key={key} className="text-center text-sm text-gray-400 italic">
                                    {label} not uploaded
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewDocument;
