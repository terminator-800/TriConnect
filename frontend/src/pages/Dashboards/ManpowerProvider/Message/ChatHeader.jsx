import { useReportedUsers } from '../../../../../hooks/REPORT';
import { getInitials } from './helper';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import ReportUser from '../../../../components/ReportUser';
import icons from '../../../../assets/svg/Icons';

const ChatHeader = ({ selectedUser }) => {

  const [showReportModal, setShowReportModal] = useState(false);

  const { data: reportedUsers = [] } = useReportedUsers(ROLE.MANPOWER_PROVIDER);

  const isUserReported = reportedUsers.includes(selectedUser?.sender_id);

  const fullName = selectedUser?.authorized_person || selectedUser?.name || 'Unknown';
  const initials = getInitials(fullName);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
      {selectedUser ? (
        <>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {initials}
            </div>

            {/* Details */}
            <div className="text-sm text-gray-700">

              <div className="font-medium">Sent by: {fullName || 'N/A'}</div>

              {selectedUser.sent_at && (
                <div className="text-xs text-gray-500">
                  Last message: {selectedUser.sent_at || 'No messages yet'}
                </div>
              )}

            </div>
          </div>

          {!isUserReported && (
            <button
              className="text-red-500 text-xl font-bold cursor-pointer"
              onClick={() => setShowReportModal(true)}
            >
              <img src={icons.report_user} alt="report user" />
            </button>
          )}
        </>

      ) : (
        <div className="text-gray-400 text-center w-full">Select a user to start chatting</div>
      )}

      {showReportModal && (
        <ReportUser
          reportedUser={selectedUser}
          conversationId={selectedUser.conversation_id}
          onClose={() => setShowReportModal(false)}
          role={ROLE.MANPOWER_PROVIDER}
        />
      )}

    </div>
  );
};

export default ChatHeader;
