import { format } from 'date-fns';

const ConversationList = ({
  selectedTab,
  setSelectedTab,
  selectedConversationId,
  setSelectedConversationId,
  jobseekerConversations = [],
  agencyConversations = [],
  allUsers = [],
  highlightedConversationId,
  user_id,
}) => {
  const renderConversationItem = (msg) => {
    const otherUserId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
    const user = allUsers.find((u) => u.user_id === otherUserId);

    const name = user?.full_name || user?.agency_name || 'Unknown';
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
      <div
        key={msg.conversation_id}
        className={`p-4 cursor-pointer transition-colors duration-200 ${
          selectedConversationId === msg.conversation_id
            ? 'bg-blue-100'
            : !msg.is_read && msg.sender_id !== user_id
            ? 'bg-cyan-100 animate-pulse'
            : highlightedConversationId === msg.conversation_id
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
                {!msg.is_read && msg.sender_id !== user_id && (
                  <span className="text-blue-600 text-xs">●</span>
                )}
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

  const dataToRender =
    selectedTab === 'jobseekers' ? jobseekerConversations : agencyConversations;

  const emptyMessage =
    selectedTab === 'jobseekers'
      ? 'No messages from jobseekers'
      : 'No messages from agencies';

  return (
    <div className="w-1/3 border-r border-gray-200">
      <div className="flex">
        <button
          onClick={() => setSelectedTab('jobseekers')}
          className={`w-1/2 py-3 text-center font-semibold ${
            selectedTab === 'jobseekers'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Job Seekers
        </button>
        <button
          onClick={() => setSelectedTab('agencies')}
          className={`w-1/2 py-3 text-center font-semibold ${
            selectedTab === 'agencies'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Agencies
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
