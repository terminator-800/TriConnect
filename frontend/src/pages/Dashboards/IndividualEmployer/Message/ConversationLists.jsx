import { getInitials } from './helper';

const ConversationList = ({ users, selectedUser, onSelect }) => {
    return (
        <ul>
            {users.map((user) => {
                const isSelected = selectedUser?.conversation_id === user.conversation_id;
                const fullName = user.authorized_person || user.agency_authorized_person || '';
                const initials = getInitials(fullName);

                return (
                    <li
                        key={user.conversation_id}
                        className={`p-4 border-b border-gray-300 cursor-pointer flex justify-between items-start gap-3
                             ${isSelected ? 'bg-blue-100' : ''}`}
                        onClick={() => onSelect(user)}
                    >
                        <div className="flex gap-2 flex-1">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {initials || '?'}
                            </div>

                            <div>
                                <div className="font-medium">{user.name || 'Unknown Name'}</div>

                                {(user.authorized_person || user.agency_authorized_person) && (
                                    <div className="text-sm text-gray-500">
                                        Authorized: {user.authorized_person || user.agency_authorized_person}
                                    </div>
                                )}

                                <div className="text-sm text-gray-700 truncate">
                                    {user.message_text}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Timestamp */}
                        <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                            {user.sent_at}
                        </div>
                    </li>

                );
            })}
        </ul>
    );
};

export default ConversationList;
