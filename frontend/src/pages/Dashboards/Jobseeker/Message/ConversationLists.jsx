import { getInitials } from './helper';

const ConversationList = ({ users, selectedUser, onSelect }) => {

    return (
        <div className="mt-5 overflow-y-auto w-full">
            <ul className="divide-y divide-gray-200">
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

                                {/* Profile || LOGO */}
                                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-gray-400 text-white font-bold text-sm">
                                    {user.profile ? (
                                        <img
                                            src={user.profile}
                                            alt={user.authorized_person || user.agency_authorized_person || 'Avatar'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        initials || '?'
                                    )}
                                </div>

                                <div>
                                    <div className="font-medium truncate max-w-[15vw]">
                                        {user.name || 'Unknown Name'}
                                    </div>

                                    {(user.authorized_person || user.agency_authorized_person) && (
                                        <div className="text-sm text-gray-500 truncate max-w-[15vw]">
                                            Authorized: {user.authorized_person || user.agency_authorized_person}
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-700 truncate max-w-[15vw]">
                                        {user.message_text || 'No message yet'}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Timestamp */}
                            <div className="text-xs text-gray-400 text-right whitespace-nowrap truncate">
                                {user.sent_at || 'Just now'}
                            </div>
                        </li>
                    );
                })}
            </ul>

        </div>
    );
};

export default ConversationList;
