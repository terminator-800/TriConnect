import { documentMap, infoMap, getImagePath } from '../../../../utils/getImagePath';
import { useEffect } from 'react';

const ViewDocument = ({ user, onClose }) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const documentsToShow = documentMap[user?.role] || [];
    const infoToShow = infoMap[user?.role] || [];

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
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
