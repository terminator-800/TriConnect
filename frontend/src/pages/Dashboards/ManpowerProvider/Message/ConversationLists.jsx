import { getInitials } from './helper';
import { useMarkAsSeen } from '../../../../../hooks/CHAT';
import { ROLE } from '../../../../../utils/role';
const ConversationList = ({ users, selectedUser, onSelect }) => {

    const { mutate: markAsSeen } = useMarkAsSeen(ROLE.MANPOWER_PROVIDER, selectedUser?.conversation_id);

    const handleSelect = (user) => {
        onSelect(user);
        if (user.message_id && !user.seen) {
            markAsSeen(user.message_id);
        }
    };

    return (
        <ul>
            {users.map((user) => {
                const isSelected = selectedUser?.conversation_id === user.conversation_id;
                const fullName = user.name || user.authorized_person;
                const initials = getInitials(fullName);
                const messagePreview = user.message_text?.slice(0, 60);
        
                return (
                    <li
                        key={user.conversation_id}
                        className={`p-4 border-b border-gray-300 cursor-pointer flex justify-between items-start gap-3
                            ${isSelected ? 'bg-blue-100' : ''}`}
                        onClick={() => handleSelect(user)}
                    >
                        <div className="flex gap-2 flex-1">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {initials || '?'}
                            </div>

                            <div className="overflow-hidden">
                                <div className="font-medium truncate">{user.name }</div>

                                {(user.business_name || fullName) && (
                                    <div className="text-sm text-gray-500 truncate">
                                        Authorized: {user.authorized_person || fullName}
                                    </div>
                                )}

                                <div className="text-sm text-gray-700 truncate">
                                    {messagePreview || 'No message'}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Timestamp */}
                        <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                            {user.sent_at || 'N/A'}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default ConversationList;
