import { ROLE_LABELS, getInitials } from '../../../../../utils/role';
import { useEffect } from 'react';

const ViewFeedback = ({ feedback, onClose }) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (!feedback) return null;

    const { name, type, color, date, message } = feedback;

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full relative border border-gray-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
                >
                    &times;
                </button>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700 italic">
                            {getInitials(name)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold italic">{name}</h2>
                        <p className={`font-bold italic ${color}`}>{ROLE_LABELS[type]}</p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-2">Submitted on: {date}</p>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-bold mb-2">Feedback</h3>
                    <div className="text-gray-800 whitespace-pre-line max-h-60 min-h-60 overflow-y-auto pr-2 hide-scrollbar">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedback;
