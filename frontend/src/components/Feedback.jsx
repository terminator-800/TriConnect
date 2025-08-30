import { useEffect, useState } from "react";
import { useSubmitFeedback } from "../../hooks/useSubmitFeedback";

const Feedback = ({ onClose, role }) => {
  const [message, setMessage] = useState('');
  const { mutate: submitFeedback, isLoading } = useSubmitFeedback(role, onClose);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter your feedback.");
      return;
    }
    submitFeedback({ message });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Feedback modal */}
      <div className="relative bg-white pl-7 pr-7 pt-5 pb-5 rounded-xl shadow-lg w-[550px] z-10 border border-gray-300">

        {/* Header */}
        <div className="border-b-4 border-gray-300 flex justify-between mb-3">
          <h2 className="text-2xl font-bold">Feedback Details</h2>
          <button
            onClick={onClose}
            className="text-blue-900 pl-4 font-bold text-2xl rounded cursor-pointer mb-2"
          >
            &times;
          </button>
        </div>

        {/* Feedback textarea */}
        <p className="text-gray-500">Your Feedback Message:</p>
        <textarea
          rows="4"
          className="w-full border border-gray-300 rounded pl-3 pr-3 pt-1 mb-4 h-[250px] outline-none resize-none"
          placeholder="As a freelancer looking for short-term construction jobs, TriConnect has been a game-changer. I no longer have to rely on word-of-mouth to find work opportunities."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        {/* Submit button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 rounded cursor-pointer ${isLoading ? 'bg-gray-400 text-gray-200' : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
