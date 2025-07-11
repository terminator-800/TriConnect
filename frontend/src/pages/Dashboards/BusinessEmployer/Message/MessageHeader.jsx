const MessageHeader = ({ selectedConversationId, messages, user_id, allUsers }) => {
<<<<<<< HEAD
=======
  // Get any message from the selected conversation
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
  const selectedMsg = messages.find(
    (msg) => msg.conversation_id === selectedConversationId
  );

<<<<<<< HEAD
=======
  // Determine the other participant's user_id
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
  const otherUserId =
    selectedMsg?.sender_id === user_id
      ? selectedMsg?.receiver_id
      : selectedMsg?.sender_id;

<<<<<<< HEAD
  const user = allUsers.find((u) => u.user_id === otherUserId);

  const name =
    user?.full_name || 
    user?.agency_name || 
    user?.business_name || 
=======
  // Find the user from allUsers
  const user = allUsers.find((u) => u.user_id === otherUserId);

  // For Business Employer, prioritize names of other roles
  const name =
    user?.full_name || // jobseeker or individual employer
    user?.agency_name || // manpower provider
    user?.business_name || // fallback
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
    'Unknown';

  const initials =
    name !== 'Unknown'
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
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
