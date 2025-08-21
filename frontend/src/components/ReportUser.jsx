import { useReportUser } from "../../hooks/REPORT";
import { useState } from "react";
import icons from "../assets/svg/Icons";

const ReportUser = ({ reportedUser, conversationId, onClose, role }) => {
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    console.log(reportedUser, 'reported user in report user');

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const { mutate: submitReport, isPending } = useReportUser(role, onClose);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!reportedUser?.role) {
            alert("Reported user's role is missing.");
            return;
        }

        if (files.length === 0) {
            alert("Please attach at least one file as proof.");
            return;
        }

        const formData = new FormData();
        formData.append("reason", reason);
        formData.append("message", message);
        formData.append("reportedUserId", reportedUser?.sender_id);
        formData.append("conversationId", conversationId);
        files.forEach((file) => formData.append("proof_files", file));


        submitReport({
            formData,
            role
        });

        if (onClose) onClose();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative border border-gray-300">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg font-bold cursor-pointer"
                >
                    &times;
                </button>

                <div className="w-full rounded-md">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                        Report User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                State your reason:
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 cursor-pointer"
                            >
                                <option value="">Select a reason</option>
                                <option value="spam">Spam</option>
                                <option value="harassment">Harassment</option>
                                <option value="inappropriate">Inappropriate Content</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Your Report Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none"
                            />
                        </div>

                        {/* File Upload + Submit */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                PROOF:
                            </label>

                            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
                                {files.length === 0 && (
                                    <label
                                        htmlFor="file-upload"
                                        className="inline-flex items-center gap-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-50 transition"
                                    >
                                        <img src={icons.pin} alt="pin" className="w-5 h-5" />
                                        Attach Files
                                    </label>
                                )}

                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {files.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto max-w-md">
                                        {files.map((file, index) => (
                                            <span
                                                key={index}
                                                className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full text-gray-700 truncate max-w-[150px] italic "
                                                title={file.name}
                                            >
                                                {file.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`ml-auto ${isPending
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-800 hover:bg-blue-900"
                                        } text-white px-6 py-2 rounded-md transition`}
                                >
                                    {isPending ? "Sending..." : "Send Report"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportUser;
