const MessageHeader = ({ selectedConversationId, messages, user_id, allUsers }) => {
  // Get any message from the selected conversation
  const selectedMsg = messages.find(
    (msg) => msg.conversation_id === selectedConversationId
  );

  // Determine the other participant's user_id
  const otherUserId =
    selectedMsg?.sender_id === user_id
      ? selectedMsg?.receiver_id
      : selectedMsg?.sender_id;

  // Find the user from allUsers
  const user = allUsers.find((u) => u.user_id === otherUserId);
  const name = user?.business_name || user?.agency_name || user?.full_name || 'Unknown';

  const initials =
    name !== 'Unknown'
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : '??';

  return (
    <div className="flex items-center justify-between border-b pb-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
          {initials}
        </div>
        <div className="font-semibold">{name}</div>
      </div>
      <div className="text-red-500 text-xl">❗</div>
    </div>
  );
};

export default MessageHeader;
