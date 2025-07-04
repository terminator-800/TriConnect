const MessageHeader = ({ selectedConversationId, messages, user_id, allUsers }) => {
  const selected = messages.find(
    (msg) => msg.conversation_id === selectedConversationId && msg.sender_id !== user_id
  );
  const user = allUsers.find((u) => u.user_id === selected?.sender_id);
  const name = user?.agency_name || user?.full_name || 'Unknown';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
