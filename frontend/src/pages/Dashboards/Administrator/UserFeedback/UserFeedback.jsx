import { ROLE_LABELS, roleColors, getInitials } from '../../../../../utils/role';
import { useUserFeedbacks } from '../../../../../hooks/useUserFeedbacks';
import { useState } from 'react';
import Sidebar from '../Sidebar';
import Pagination from '../../../../components/Pagination';
import ViewFeedback from './ViewFeedback';

const UserFeedback = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const itemsPerPage = 4;

  const { feedbacks = [], isLoading, error } = useUserFeedbacks();

  if (isLoading) return <div>Loading feedbacks...</div>;
  if (error) return <div>Error loading feedbacks: {error.message}</div>;

  const mappedFeedbacks = feedbacks.map((fb) => {
    const name = fb.user_name || 'Unknown';
    return {
      id: fb.feedback_id ?? 'N/A',                  
      name,
      type: fb.role || 'Unknown',
      color: roleColors[fb.role] || 'text-gray-500',
      date: fb.submitted_at || 'Unknown',
      message: fb.message || 'No message provided',
      initials: getInitials(name) || 'Unknown',           
    };
  });

  const totalPages = Math.ceil(mappedFeedbacks.length / itemsPerPage);
  const currentItems = mappedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50 flex flex-col">
        <h1 className="text-5xl font-bold text-blue-900">User Feedback</h1>
        <p className="text-2xl mt-2">
          Review and manage feedback submitted by TriConnect users
        </p>

        <div className="w-full rounded mt-15 flex flex-col flex-1">
          {/* Table Section */}
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-300 text-left">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date Submitted
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((fb) => (
                  <tr key={`${fb.id}-${fb.date}`}>
                    <td className="px-6 py-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-gray-600 italic">
                          {fb.initials}
                        </span>
                      </div>
                      <span className="font-semibold italic">{fb.name}</span>
                    </td>
                    <td className={`px-6 py-4 font-bold text-sm italic ${fb.color}`}>
                      {ROLE_LABELS[fb.type]}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{fb.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedFeedback(fb)}
                        className="px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800 cursor-pointer"
                      >
                        View Feedback
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Show empty row if no users */}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      No feedback available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination fixed at the bottom */}
          <div className="mt-10 mb-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>


      {/* Feedback Modal */}
      {selectedFeedback && (
        <ViewFeedback
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </>
  );
};

export default UserFeedback;
