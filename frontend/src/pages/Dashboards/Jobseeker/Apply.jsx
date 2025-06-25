import { useState } from 'react';
import { useJobseekerProfile } from '../../../../hooks/useUserProfiles';
import axios from 'axios';

const Apply = ({ jobPost, employer, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        data: profileData,
        isLoading: loadingProfile,
        isError: profileError,
    } = useJobseekerProfile();

    const handleSubmit = async () => {
        if (!profileData?.user_id || !message.trim()) return;

        setIsSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/jobseeker/applications`, {
                job_post_id: jobPost.job_post_id,
                sender_id: profileData.user_id,
                receiver_id: employer.user_id,
                message,
            });

            setSuccess(true);
            setMessage('');

            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Application failed:', error.response?.data || error.message);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
                Apply to {employer.business_name || employer.full_name || employer.agency_name || 'Employer'}
            </h2>

            <textarea
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message or application..."
                className="w-full p-3 border border-gray-300 rounded resize-none"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={onClose}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || loadingProfile || !message.trim()}
                    className={`px-4 py-2 rounded text-white ${isSubmitting || loadingProfile
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-blue-900 hover:bg-blue-800'
                        }`}
                >
                    {isSubmitting ? 'Sending...' : 'Send Application'}
                </button>
            </div>

            {success && <p className="text-green-600 mt-3">Application sent successfully!</p>}
            {profileError && <p className="text-red-600 mt-3">Failed to load profile data.</p>}
        </div>
    );
};

export default Apply;
