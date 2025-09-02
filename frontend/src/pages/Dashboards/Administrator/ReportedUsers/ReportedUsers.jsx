import { useAllReportedUsers } from '../../../../../hooks/REPORT';
import { useState } from 'react';
import ViewReportedUser from './ViewReportedUser';
import Pagination from '../../../../components/Pagination';
import Sidebar from '../Sidebar';

const USERS_PER_PAGE = 4;

const roleColors = {
  'manpower-provider': 'text-orange-500',
  'business-employer': 'text-green-600',
  'individual-employer': 'text-yellow-500',
  'jobseeker': 'text-blue-600',
};

const ReportedUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const { data: allReportedUsers = [], isLoading, isError } = useAllReportedUsers();

  const totalPages = Math.ceil(allReportedUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = allReportedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const getInitials = (entity = '') => {
    const parts = entity.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">Reported Users</h1>
          <p className="text-lg text-gray-700 mt-1">Tagline</p>

          <div className="flex-1 mt-10">
            <div className="overflow-hidden rounded-xl shadow bg-white">
              <table className="w-full text-left">

                <thead>
                  <tr className="bg-gray-400 text-gray-700 text-sm rounded-t-xl">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">User Type</th>
                    <th className="px-6 py-4">Report Reason</th>
                    <th className="px-6 py-4">Date Reported</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {isLoading && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-600">
                        Loading reported users...
                      </td>
                    </tr>
                  )}

                  {isError && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-red-600">
                        Failed to load reported users.
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-600">
                        No reported users found.
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && paginatedUsers.map((report) => (
                    <tr key={report.report_id} className="border-t border-gray-200">
                      {/* User Info */}
                      <td className="px-6 py-5 flex items-center gap-3 italic">
                        <div className="w-10 h-10 bg-gray-200 text-sm font-medium text-gray-600 rounded-full flex items-center justify-center">
                          {getInitials(report.reported_user?.entity) || 'N/A'}
                        </div>
                        <div>
                          <div className="font-semibold">{report.reported_user?.entity || 'N/A'}</div>
                        </div>
                      </td>

                      {/* User Type */}
                      <td className={`px-6 py-5 capitalize text-sm font-bold italic ${roleColors[report.reported_user?.role] || 'text-gray-700'}`}>
                        {report.reported_user?.role.replace('-', ' ')}
                      </td>

                      {/* Report Reason */}
                      <td className="px-6 py-5">
                        <div className="font-semibold">{report.reason}</div>
                        <div className="text-xs text-gray-500">
                          Reported by: {report.reporter?.name || report.reporter?.user_id || 'N/A'}
                        </div>
                        {report.proofs?.length > 0 && (
                          <div className="mt-1 text-xs text-gray-600 italic">
                            {report.proofs.length} proof{report.proofs.length > 1 ? 's' : ''} attached
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-gray-700">
                        <span>{report.created_at || 'just now'}</span>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        <button
                          disabled={!report.can_view}
                          onClick={() => setSelectedReport(report)}
                          className={`px-5 py-1.5 rounded text-white text-sm font-medium ${report.can_view ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-300 cursor-not-allowed'} cursor-pointer`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination always at bottom */}
        <div className='mt-10 mb-10'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <ViewReportedUser
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      </div>
    </>
  );
};

export default ReportedUser;
