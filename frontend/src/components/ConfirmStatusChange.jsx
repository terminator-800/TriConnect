import { useState } from 'react';

const ConfirmStatusChange = ({ title = 'Confirm Status Change', onConfirm }) => {
  const [visible, setVisible] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const showModal = (data) => {
    setStatusData(data);
    setVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const hideModal = () => {
    setVisible(false);
    setStatusData(null);
    document.body.style.overflow = 'auto';
  };

  const handleConfirm = async () => {
    if (statusData) {
      await onConfirm(statusData);
      hideModal();
    }
  };

  const ModalUI = () =>
    visible && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative border border-gray-300">
          <button
            onClick={hideModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold cursor-pointer"
            title="Close"
          >
            &times;
          </button>
          <div className="p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2">
              Are you sure you want to change the status to{' '}
              <strong>{statusData?.status}</strong>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={hideModal}
                className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return { showModal, ModalUI };
};

export default ConfirmStatusChange;
