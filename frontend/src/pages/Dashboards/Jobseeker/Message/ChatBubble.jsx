import { format } from 'date-fns';
import getChatImagePath from '../../../../../utils/getChatImagePath';

const ChatBubble = ({ msg, isOwnMessage, isLastOwnMessage }) => {
  const fileUrl = getChatImagePath(msg);

  return (
    <div
      className={`relative max-w-sm p-3 rounded mb-2 ${
        isOwnMessage ? 'bg-blue-200 ml-auto text-right' : 'bg-gray-100 text-left'
      }`}
    >
      <div>{msg.message_text}</div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-sm underline mt-1"
        >
          View Attachment
        </a>
      )}

      <div className="text-xs text-gray-600 mt-1 flex justify-between items-center">
        <span>{format(new Date(msg.created_at), 'hh:mm a')}</span>

        {/* ✅ Seen indicator logic stays the same */}
        {isOwnMessage && isLastOwnMessage && msg.is_read && (
          <span className="ml-2 text-blue-600 font-semibold">Seen</span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
