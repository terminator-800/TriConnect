import { ROLE } from "../../../../../utils/role";
import { useEffect, useMemo, useRef } from 'react';
import { useMarkAsSeen } from '../../../../../hooks/CHAT'; 

export const getTabFromLocalStorage = () => {
    return localStorage.getItem('chat-active-tab') || ROLE.JOBSEEKER;
};

export const saveTabToLocalStorage = (tab) => {
    localStorage.setItem('chat-active-tab', tab);
};


export const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '?';

    const parts = fullName.trim().split(' ');

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    const firstInitial = parts[0][0] || '';
    const lastInitial = parts[parts.length - 1][0] || '';

    return (firstInitial + lastInitial).toUpperCase();
};

export const filterAndMapConversations = (conversations, activeTab) => {
    const filtered = conversations.filter(convo => convo.role === activeTab);
    const unknown = 'Unknown';

    return filtered.map(convo => {
        let name = unknown;
        let authorized_person = null;

        switch (convo.role) {
            case ROLE.JOBSEEKER:
                name = convo.full_name || unknown;
                authorized_person = convo.full_name;
                break;
            case ROLE.MANPOWER_PROVIDER:
                name = convo.agency_name || unknown;
                authorized_person = convo.agency_authorized_person || null;
                break;
            default:
                authorized_person = null;
                break;
        }

        return {
            sender_id: convo.sender_id,
            name,
            message_text: convo.message_text,
            sent_at: convo.sent_at,
            role: convo.role,
            conversation_id: convo.conversation_id,
            authorized_person,
        };
    });
};

// Chat Winow Helpers
export const useMarkMessagesAsSeen = ({ role, conversation_id, messages, currentUserId }) => {
  const markedSeenRef = useRef(new Set());
  const markAsSeen = useMarkAsSeen(role, conversation_id);

  const allMessageIds = useMemo(() => {
    return messages
      .filter(
        (msg) =>
          Number(msg.receiver_id) === Number(currentUserId) &&
          !msg.is_read
      )
      .map((msg) => msg.message_id);
  }, [messages, currentUserId]);

  const newMessagesToMark = useMemo(() => {
    if (!conversation_id) {
      markedSeenRef.current = new Set(); 
      return [];
    }
    return allMessageIds.filter((id) => !markedSeenRef.current.has(id));
  }, [conversation_id, allMessageIds]);

  useEffect(() => {
    if (newMessagesToMark.length > 0 && !markAsSeen.isPending) {
      markAsSeen.mutate({ message_id: newMessagesToMark });
      newMessagesToMark.forEach((id) => markedSeenRef.current.add(id));
    }
  }, [newMessagesToMark, markAsSeen]);
};


