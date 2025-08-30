const ViewProfile = ({ applicant, onClose }) => {
    if (!applicant) return null;
    console.log(applicant, "APPLICANT");

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">


            {/* AWe */}
            <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
                <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-[100vh] overflow-y-auto border border-gray-300">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                    >
                        &times;
                    </button>
                    <div className="bg-white rounded-2xl p-6 w-96">
                        <h2 className="text-2xl font-bold mb-4">{applicant.applicant_name}</h2>
                        <p><strong>Job Applied:</strong> {applicant.job_title}</p>
                        <p><strong>Location:</strong> {applicant.location || '-'}</p>
                        <p><strong>Date Applied:</strong> {applicant.applied_at_formatted || '-'}</p>
                        <p><strong>Email:</strong> {applicant.email || '-'}</p>
                        <p><strong>Role:</strong> {applicant.applicant_role || '-'}</p>
                        {/* Add more fields as needed */}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ViewProfile