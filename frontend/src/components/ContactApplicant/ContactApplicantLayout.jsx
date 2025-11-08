import { useSendMessage } from "../../../hooks/useSendMessage";
import { useState } from "react";

const ContactApplicant = ({ onClose, applicant, role }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const { mutate: sendMessage, isPending } = useSendMessage(role);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    sendMessage({
      receiver_id: applicant?.applicant_user_id, 
      message_text: message,
      conversation_id: applicant?.conversation_id || null,
      files: file ? [file] : [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Contact Applicant</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Message Field */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Your Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
              rows="4"
              placeholder="Introduce yourself and explain why you're interested in this position. Include any relevant experience or skills."
              required
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Documents (Optional)
            </label>
            <label className="flex items-center gap-2 text-blue-600 border border-blue-500 rounded-md px-4 py-2 cursor-pointer w-fit hover:bg-blue-50">
              📎 Attach Files
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && <p className="mt-2 text-sm text-gray-600">📄 {file.name}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={`${isPending ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
                } text-white font-semibold px-5 py-2 rounded-md transition cursor-pointer`}
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactApplicant;
