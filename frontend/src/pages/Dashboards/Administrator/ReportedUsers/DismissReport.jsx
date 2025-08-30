import { useState } from 'react';
import { ROLE_LABELS } from '../../../../../utils/role';
import { useDismissReport } from '../../../../../hooks/useDismissReport'; 

const roleColors = {
  'manpower-provider': 'text-orange-500',
  'business-employer': 'text-green-600',
  'individual-employer': 'text-yellow-500',
  'jobseeker': 'text-blue-600',
};

const DismissReport = (onDone) => {
  const [visible, setVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { mutate: dismissReport, isLoading } = useDismissReport();

  const showModal = (report) => {
    setReportData(report);
    setVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const hideModal = () => {
    setVisible(false);
    setReportData(null);
    document.body.style.overflow = 'auto';
  };

  const handleConfirm = () => {
    if (!reportData) return;

    dismissReport(
      { reportId: reportData.reportId }, 
      {
        onSuccess: () => {
          alert(`Report for "${reportData.name}" has been dismissed.`);
          hideModal();
          if (onDone) onDone(); 
        },
        onError: () => {
          alert('Something went wrong while dismissing the report.');
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

          <div className="p-6">
            <h2 className="text-lg font-semibold text-green-600">Confirm Dismiss</h2>
            <p className="mt-3 text-gray-700">
              Are you sure you want to <strong>dismiss</strong> this report?
            </p>
            {reportData && (
              <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
                <p className="font-semibold">{reportData.name}</p>
                <p
                  className={`text-sm font-medium italic ${
                    roleColors[reportData.role] || 'text-gray-600'
                  }`}
                >
                  {ROLE_LABELS[reportData.role] || 'Unknown Role'}
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
                className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Dismissing...' : 'Yes, Dismiss Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return { showModal, ModalUI };
};

export default DismissReport;
