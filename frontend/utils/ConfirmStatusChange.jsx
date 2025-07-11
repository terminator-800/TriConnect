import { useState } from 'react';

const ConfirmStatusChange = ({
  title = 'Confirmation',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirmAction,
}) => {
  const [visible, setVisible] = useState(false);
  const [contextData, setContextData] = useState(null);

  const showModal = (data = null) => {
    setContextData(data);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setContextData(null);
  };

  const handleConfirm = () => {
    if (onConfirmAction && contextData) {
      onConfirmAction(contextData);
    }
    hideModal();
  };

  const ModalUI = () =>
    visible && (
      <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md max-w-sm w-full border border-gray-300">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <p className="mb-4">
            {typeof message === 'function' ? message(contextData) : message}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={hideModal}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );

  return { showModal, ModalUI };
};

export default ConfirmStatusChange;
