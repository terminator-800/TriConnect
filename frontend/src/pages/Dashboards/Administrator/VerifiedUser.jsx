import { useVerifiedUsers } from '../../../../hooks/useUserProfiles';
import { ROLE, ROLE_LABELS } from '../../../../utils/role';
import { useState } from 'react';
import ViewDocument from './ViewDocument';
import Pagination from '../../../components/Pagination';
import Sidebar from './Sidebar';

const VerifiedUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  const { data: verifiedUsers = [], isLoading, isError, error } = useVerifiedUsers();
  const [selectedUser, setSelectedUser] = useState(null);

  // pagination
  const totalPages = Math.ceil(verifiedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = verifiedUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-cyan-400 
            2xl:pl-110
            2xl:pr-50
            lg:pl-70
            lg:pr-10
            md:pl-15
            md:pr-15
            max-[769px]:px-10
             pt-50
             ">

        <h1 className="text-2xl font-bold text-blue-900">Verified Users</h1>
        <p className="mt-2">
          Browse and manage users who have been verified on the platform
        </p>

        <div className="flex-1">
          {isLoading ? (
            <p className="mt-10 text-lg text-gray-600">Loading verified users...</p>
          ) : isError ? (
            <p className="mt-10 text-red-500">{error?.message || 'Failed to load verified users.'}</p>
          ) : verifiedUsers.length === 0 ? (
            <p className="mt-10 text-lg text-gray-500 italic">
              No verified users found.
            </p>
          ) : (
            <div className="mt-10 flex-1 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-1/3">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-1/3">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-1/3">
                      Verification Date
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => {
                    const name =
                      user.full_name ||
                      user.business_name ||
                      user.agency_name ||
                      'N/A';

                    return (
                      <tr key={user.user_id} className="border-t border-gray-300">
                        {/* User's Profile */}
                        <td className="px-5 py-4 flex items-center space-x-3 whitespace-nowrap">
                          {user.profile ? (
                            <img
                              src={user.profile}
                              alt={name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold italic text-gray-800">
                              {name
                                .split(' ')
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                          )}
                          <span className="italic font-semibold">{name}</span>
                        </td>

                        {/* Role */}
                        <td
                          className={`px-6 py-4 text-sm font-bold italic whitespace-nowrap ${user.role === ROLE.JOBSEEKER
                              ? 'text-blue-500'
                              : user.role === ROLE.BUSINESS_EMPLOYER
                                ? 'text-green-500'
                                : user.role === ROLE.MANPOWER_PROVIDER
                                  ? 'text-orange-500'
                                  : user.role === ROLE.INDIVIDUAL_EMPLOYER
                                    ? 'text-yellow-500'
                                    : 'text-gray-500'
                            }`}
                        >
                          {ROLE_LABELS[user.role] || user.role}
                        </td>

                        {/* Verification Date */}
                        <td className="px-5 py-4 flex justify-between items-center whitespace-nowrap">
                          <span className="text-gray-800">
                            {user.verified_at ? (
                              <span className="text-gray-500">{user.verified_at}</span>
                            ) : (
                              'N/A'
                            )}
                          </span>
                          <button
                            className="bg-gray-200 px-4 py-1 rounded text-sm cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          )}
        </div>

        <div className='mt-10 mb-10'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

      </div>

      {selectedUser && (
        <ViewDocument
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default VerifiedUser;