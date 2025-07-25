import { useState } from "react";
import icons from "../../../../assets/svg/Icons";
import ReportUser from "../../../../components/ReportUser";
import { useReportedUsers } from "../../../../../hooks/useReportUser"; 
import { ROLE } from "../../../../../utils/role";

const MessageHeader = ({ selectedConversationId, messages, user_id, allUsers, role }) => {
  const [showReportForm, setShowReportForm] = useState(false);

  const selectedMsg = messages.find(
    (msg) => msg.conversation_id === selectedConversationId
  );

  const otherUserId =
    selectedMsg?.sender_id === user_id
      ? selectedMsg?.receiver_id
      : selectedMsg?.sender_id;

  const user = allUsers.find((u) => u.user_id === otherUserId);
  const name = user?.business_name || user?.agency_name || user?.full_name || "Unknown";

  const initials =
    name !== "Unknown"
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";

  const { data: reportedUserIds = [], isLoading } = useReportedUsers(ROLE.JOBSEEKER);  
  const isAlreadyReported = reportedUserIds.includes(otherUserId);

  return (
    <>
      {/* User's Name */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="font-semibold">{name}</div>
        </div>

        {/* Report Button (Hide if already reported) */}
        {!isLoading && !isAlreadyReported && (
          <button
            className="text-red-500 text-xl cursor-pointer"
            onClick={() => setShowReportForm(true)}
          >
            <img src={icons.report_user} alt="report user" />
          </button>
        )}
      </div>

      {showReportForm && (
        <ReportUser
          reportedUser={user}
          conversationId={selectedConversationId}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </>
  );
};

export default MessageHeader;
