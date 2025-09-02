import { ROLE, ROLE_LABELS } from '../../../../../utils/role';
import { useState } from 'react';
import PreviewReportImage from './PreviewReportImage';
import ConfirmReport from './ConfirmReport';
import DismissReport from './DismissReport';
import icons from '../../../../assets/svg/Icons';

const roleColors = {
    [ROLE.MANPOWER_PROVIDER]: 'text-orange-500',
    [ROLE.BUSINESS_EMPLOYER]: 'text-green-600',
    [ROLE.INDIVIDUAL_EMPLOYER]: 'text-yellow-500',
    [ROLE.JOBSEEKER]: 'text-blue-600',
};

const ViewReportedUser = ({ report, onClose }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const { showModal: showConfirmRestriction, ModalUI: RestrictionModalUI } = ConfirmReport(onClose);
    const { showModal: showConfirmDismiss, ModalUI: DismissModalUI } = DismissReport(onClose);

    if (!report) return null;

    const getRoleLabel = (role) => ROLE_LABELS[role] || 'Unknown';

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
                <div className="bg-white w-[500px] max-w-full rounded-xl shadow-lg p-6 relative border border-gray-300">
                    {/* Header */}
                    <div className="bg-blue-900 text-white px-4 py-3 rounded-t-xl -mx-6 -mt-6 mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Report Details</h2>
                        <button
                            className="text-white text-2xl font-bold hover:text-gray-300 cursor-pointer"
                            onClick={onClose}
                        >
                            <img src={icons.close} alt="" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Reported User */}
                        <div>
                            <p className="text-gray-700 font-semibold">Reported User:</p>
                            <p className="text-gray-900 font-semibold italic">{report.reported_user?.entity || 'N/A'}</p>
                            <p className="text-gray-900">
                                <span className='text-gray-500 text-sm'>Authorized person: </span>
                                <span className='font-semibold italic'>{report.reported_user?.name || 'N/A'}</span>
                            </p>
                            <p className={`text-sm italic font-semibold ${roleColors[report.reported_user?.role || 'N/A']}`}>
                                {getRoleLabel(report.reported_user?.role)}
                            </p>
                        </div>

                        {/* Reporter */}
                        <div>
                            <p className="text-gray-700 font-semibold">Reported By:</p>
                            <p className="text-gray-900 font-semibold italic">{report.reporter?.entity || 'N/A'}</p>
                            <p className="text-gray-900">
                                <span className='text-sm text-gray-500'>Authorized person: </span>
                                <span className='font-semibold italic'>{report.reporter?.name || 'N/A'}</span>
                            </p>
                            <p className={`text-sm font-semibold italic ${roleColors[report.reporter?.role]}`}>
                                {getRoleLabel(report.reporter?.role || 'N/A')}
                            </p>
                        </div>

                        {/* Reason */}
                        <div>
                            <p className="text-gray-700 font-semibold">Report Reason:</p>
                            <p className="italic font-semibold">{report.reason || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Date Reported: {report.created_at || 'N/A'}
                            </p>
                            {report.message && (
                                <p className="mt-2 font-semibold text-sm italic">
                                    "{report.message || "N/A"}"
                                </p>
                            )}
                        </div>

                        {/* Proof Thumbnails */}
                        {report.proofs?.length > 0 && (
                            <div>
                                <p className="text-gray-700 font-semibold">Proof:</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {report.proofs.map((proof) => {
                                        const url = proof.file_url; // Use the API-provided Cloudinary URL directly
                                        return (
                                            <button
                                                key={proof.proof_id}
                                                onClick={() => setPreviewImage(url)}
                                                className="w-24 h-24 overflow-hidden rounded-lg shadow hover:scale-105 transform transition cursor-pointer"
                                            >
                                                <img
                                                    src={url}
                                                    alt="Proof"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.target.src = '/placeholder.png')}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                            onClick={() =>
                                showConfirmRestriction({
                                    name: report.reported_user?.name,
                                    role: report.reported_user?.role,
                                    userId: report.reported_user?.user_id,
                                })
                            }
                        >
                            Restrict User
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                            onClick={() =>
                                showConfirmDismiss({
                                    name: report.reported_user?.name,
                                    role: report.reported_user?.role,
                                    reportId: report.report_id,
                                })
                            }
                        >
                            Dismiss Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Preview */}
            <PreviewReportImage
                imageUrl={previewImage}
                onClose={() => setPreviewImage(null)}
            />

            {/* Restrict and Dismiss UI */}
            <RestrictionModalUI />
            <DismissModalUI />
        </>
    );
};

export default ViewReportedUser;
