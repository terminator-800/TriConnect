import { format } from 'date-fns';

const ConversationList = ({
  selectedTab,
  setSelectedTab,
  selectedConversationId,
  setSelectedConversationId,
  employerConversations,
  jobseekerConversations, 
  allUsers,
  highlightedConversationId,
  user_id
}) => {

  const unknown = 'Unknown'
  const employer = 'employer'
  const jobseeker = 'jobseeker'

  const renderConversationItem = (msg) => {
    const otherUserId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
    const user = allUsers.find((u) => u.user_id === otherUserId);
    const name = user?.business_name || user?.full_name || unknown;

    const initials = name !== unknown
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : '??';

    const isUnread = !msg.is_read && msg.sender_id !== user_id;
    const isActive = selectedConversationId === msg.conversation_id;
    const isHighlighted = highlightedConversationId === msg.conversation_id;

    return (
      <div
        key={msg.conversation_id}
        className={`p-4 cursor-pointer transition-colors duration-200 ${
          isActive
            ? 'bg-blue-100'
            : isUnread
              ? 'bg-cyan-100 animate-pulse'
              : isHighlighted
                ? 'bg-blue-300'
                : ''
        }`}
        onClick={() => setSelectedConversationId(msg.conversation_id)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>{name}</span>
              <span className="flex items-center gap-1">
                {isUnread && <span className="text-blue-600 text-xs">●</span>}
                {format(new Date(msg.created_at), 'hh:mm a')}
              </span>
            </div>
            <div className="text-gray-500 text-sm truncate">
              {msg.message_text || '[Image]'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dataToRender = selectedTab === employer
    ? employerConversations
    : jobseekerConversations ?? [];

  const emptyMessage = selectedTab === employer
    ? 'No messages from employers'
    : 'No messages from jobseekers';

  return (
    <div className="w-1/3 border-r border-gray-200">
      <div className="flex">
        <button
          onClick={() => setSelectedTab(employer)}
          className={`w-1/2 py-3 text-center font-semibold ${
            selectedTab === employer
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Employers
        </button>
        <button
          onClick={() => setSelectedTab(jobseeker)}
          className={`w-1/2 py-3 text-center font-semibold ${
            selectedTab === jobseeker
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Jobseekers
        </button>
      </div>

      {dataToRender.length > 0 ? (
        dataToRender.map(renderConversationItem)
      ) : (
        <div className="p-6 text-center text-gray-400">{emptyMessage}</div>
      )}
    </div>
  );
};

export default ConversationList;