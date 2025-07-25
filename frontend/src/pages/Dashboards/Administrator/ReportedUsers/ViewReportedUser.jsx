import { useState } from 'react';
import { format } from 'date-fns';
import { ROLE, ROLE_LABELS } from '../../../../../utils/role';
import { getImageReportPath } from '../../../../../utils/getImageReportPath';
import PreviewReportImage from './PreviewReportImage';
import ConfirmReport from './ConfirmReport';
import DismissReport from './DismissReport';

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
                            &times;
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Reported User */}
                        <div>
                            <p className="text-gray-700 font-semibold">Reported User:</p>
                            <p className="text-gray-900">{report.reported_user?.name}</p>
                            <p className={`text-sm italic font-semibold ${roleColors[report.reported_user?.role]}`}>
                                {getRoleLabel(report.reported_user?.role)}
                            </p>
                        </div>

                        {/* Reporter */}
                        <div>
                            <p className="text-gray-700 font-semibold">Reported By:</p>
                            <p className="text-gray-900">{report.reporter?.name}</p>
                            <p className={`text-sm font-semibold italic ${roleColors[report.reporter?.role]}`}>
                                {getRoleLabel(report.reporter?.role)}
                            </p>
                        </div>

                        {/* Reason */}
                        <div>
                            <p className="text-gray-700 font-semibold">Report Reason:</p>
                            <p className="italic text-gray-600">{report.reason}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Date Reported: {format(new Date(report.created_at), 'MMM d, yyyy')}
                            </p>
                            {report.message && (
                                <p className="mt-2 text-gray-800 text-sm">
                                    "{report.message}"
                                </p>
                            )}
                        </div>

                        {/* Proof Thumbnails */}
                        {report.proofs?.length > 0 && (
                            <div>
                                <p className="text-gray-700 font-semibold">Proof:</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {report.proofs.map((proof) => {
                                        const url = getImageReportPath(proof.file_url);
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
