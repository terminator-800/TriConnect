import { useRestrictUser } from '../../../../../hooks/useRestrictUser';
import { ROLE_LABELS } from '../../../../../utils/role';
import { useState } from 'react';

const roleColors = {
  'manpower-provider': 'text-orange-500',
  'business-employer': 'text-green-600',
  'individual-employer': 'text-yellow-500',
  'jobseeker': 'text-blue-600',
};

const ConfirmReport = (onDone) => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { mutate: restrictUser, isLoading } = useRestrictUser();

  const showModal = (user) => {
    setUserData(user);
    setVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const hideModal = () => {
    setVisible(false);
    setUserData(null);
    document.body.style.overflow = 'auto';
  };

  const handleConfirm = () => {
    if (!userData) return;

    restrictUser(
      { userId: userData.userId },
      {
        onSuccess: () => {
          alert(`User "${userData.name}" has been restricted.`);
          hideModal();
          if (onDone) onDone(); // Closes parent modal (ViewReportedUser)
        },
        onError: () => {
          alert('Something went wrong while restricting the user.');
        },
      }
    );
  };

  const ModalUI = () =>
    visible && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative border border-gray-300">
          {/* Close Button */}
          <button
            onClick={hideModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold cursor-pointer"
            title="Close"
          >
            &times;
          </button>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-red-600">Confirm Restriction</h2>
            <p className="mt-3 text-gray-700">
              Are you sure you want to <strong>restrict</strong> the following user?
            </p>
            {userData && (
              <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
                <p className="font-semibold">{userData.name}</p>
                <p
                  className={`text-sm font-medium italic ${
                    roleColors[userData.role] || 'text-gray-600'
                  }`}
                >
                  {ROLE_LABELS[userData.role] || 'Unknown Role'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={hideModal}
                className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Restricting...' : 'Yes, Restrict User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return { showModal, ModalUI };
};

export default ConfirmReport;
