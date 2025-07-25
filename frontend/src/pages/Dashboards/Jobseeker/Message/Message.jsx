import { ROLE, ROLE_CATEGORY } from '../../../../../utils/role';
import { useEffect, useRef, useReducer, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useChat } from '../../../../../hooks/useChats';
import { useJobseekerProfile, useAllUsers } from '../../../../../hooks/useUserProfiles';
import { useSendMessage } from '../../../../../hooks/useSendMessage';
import messageApi from '../../../../../api/messageApi';
import Sidebar from '../Sidebar';
import ConversationList from './ConversationList';
import MessageHeader from './MessageHeader';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';

const MAX_LAST_SEEN_TRACK = 500;
const ACTIONS = {
  SET_TEXT: 'SET_TEXT',
  SET_FILE: 'SET_FILE',
  SET_SELECTED_TAB: 'SET_SELECTED_TAB',
  SET_SELECTED_CONVERSATION: 'SET_SELECTED_CONVERSATION',
  SET_CONVERSATION_SUMMARIES: 'SET_CONVERSATION_SUMMARIES',
  ADD_CONVERSATION_SUMMARY: 'ADD_CONVERSATION_SUMMARY',
  SET_HIGHLIGHTED_CONVERSATION: 'SET_HIGHLIGHTED_CONVERSATION',
  SET_VISIBLE_COUNT: 'SET_VISIBLE_COUNT',
};

const initialState = {
  text: '',
  file: null,
  selectedTab: ROLE_CATEGORY.EMPLOYER,
  selectedConversationId: null,
  conversationSummaries: [],
  highlightedConversationId: null,
  visibleCount: 10,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TEXT:
      return { ...state, text: action.payload };
    case ACTIONS.SET_FILE:
      return { ...state, file: action.payload };
    case ACTIONS.SET_SELECTED_TAB:
      return { ...state, selectedTab: action.payload };
    case ACTIONS.SET_SELECTED_CONVERSATION:
      return { ...state, selectedConversationId: action.payload };
    case ACTIONS.SET_CONVERSATION_SUMMARIES:
      return { ...state, conversationSummaries: action.payload };
    case ACTIONS.ADD_CONVERSATION_SUMMARY: {
      const updated = state.conversationSummaries.filter(
        (msg) => msg.conversation_id !== action.payload.conversation_id
      );
      return {
        ...state,
        conversationSummaries: [...updated, action.payload].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      };
    }
    case ACTIONS.SET_HIGHLIGHTED_CONVERSATION:
      return { ...state, highlightedConversationId: action.payload };
    case ACTIONS.SET_VISIBLE_COUNT:
      return { ...state, visibleCount: action.payload };
    default:
      return state;
  }
}

const Message = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastSeenRef = useRef([]);
  const messageContainerRef = useRef(null);

  const { data: profile } = useJobseekerProfile();
  const user_id = profile?.user_id;

  const { data: allUsers = [] } = useAllUsers();

  const mutation = useSendMessage(ROLE.JOBSEEKER, user_id);
  const { messages } = useChat(state.selectedConversationId, user_id, ROLE.JOBSEEKER);

  const { data: conversationSummaries = [] } = useQuery({
    queryKey: ['conversationSummaries', ROLE.JOBSEEKER],
    queryFn: async () => {
      const conversations = await messageApi.fetchConversations(ROLE.JOBSEEKER);
      const messages = await messageApi.fetchMessagesForConversations(ROLE.JOBSEEKER, conversations);
      const grouped = {};
      messages.forEach((msg) => {
        const id = msg.conversation_id;
        if (!grouped[id] || new Date(msg.created_at) > new Date(grouped[id].created_at)) {
          grouped[id] = { ...msg, is_read: msg.is_read };
        }
      });
      return Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
  });

  const markSeenMutation = useMutation({
    mutationFn: ({ ids, role, userId }) => messageApi.markAsSeen(ids, role, userId),
  });

  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_CONVERSATION_SUMMARIES,
      payload: conversationSummaries,
    });
  }, [conversationSummaries]);

  const conversationsWithUsers = useMemo(() => {
    return state.conversationSummaries.map((msg) => {
      const otherUserId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
      const user = allUsers.find((u) => u.user_id === otherUserId);
      return { ...msg, user };
    });
  }, [state.conversationSummaries, allUsers, user_id]);

  const employerConversations = useMemo(
    () => conversationsWithUsers.filter((item) => item.user && !item.user.agency_name),
    [conversationsWithUsers]
  );

  const agencyConversations = useMemo(
    () => conversationsWithUsers.filter((item) => item.user && item.user.agency_name),
    [conversationsWithUsers]
  );

  const selectedMessages = useMemo(
    () => messages.filter((msg) => msg.conversation_id === state.selectedConversationId),
    [messages, state.selectedConversationId]
  );

  const handleSend = () => {
    if ((!state.text && !state.file) || !state.selectedConversationId || !profile) return;

    const selectedConversation = state.conversationSummaries.find(
      (conv) => conv.conversation_id === state.selectedConversationId
    );

    if (!selectedConversation) return alert('No valid conversation found');

    const receiver_id =
      selectedConversation.sender_id === user_id
        ? selectedConversation.receiver_id
        : selectedConversation.sender_id;

    mutation.mutate({
      receiver_id,
      message_text: state.text,
      file: state.file,
      conversation_id: state.selectedConversationId,
    });

    dispatch({ type: ACTIONS.SET_TEXT, payload: '' });
    dispatch({ type: ACTIONS.SET_FILE, payload: null });
  };

  useEffect(() => {
    if (messages.length) {
      const latest = messages[messages.length - 1];
      dispatch({ type: ACTIONS.ADD_CONVERSATION_SUMMARY, payload: latest });
      dispatch({ type: ACTIONS.SET_HIGHLIGHTED_CONVERSATION, payload: latest.conversation_id });
    }
  }, [messages]);

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_VISIBLE_COUNT, payload: 10 });
  }, [state.selectedConversationId]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 50) {
        dispatch({ type: ACTIONS.SET_VISIBLE_COUNT, payload: state.visibleCount + 10 });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [state.visibleCount]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    if (!messages.length || !state.selectedConversationId || !user_id) return;

    const unreadIds = messages
      .filter(
        (msg) =>
          msg.conversation_id === state.selectedConversationId &&
          msg.sender_id !== user_id &&
          !msg.is_read
      )
      .map((msg) => msg.message_id);

    const unseen = unreadIds.filter((id) => !lastSeenRef.current.includes(id));
    if (!unseen.length) return;

    markSeenMutation.mutate({
      ids: unseen,
      role: ROLE.JOBSEEKER,
      userId: user_id,
    });

    lastSeenRef.current = Array.from(new Set([...lastSeenRef.current, ...unseen])).slice(
      -MAX_LAST_SEEN_TRACK
    );
  }, [messages, state.selectedConversationId, user_id]);

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
        <h1 className="text-5xl font-bold text-blue-900">Messages</h1>
        <p className="mb-6">View and manage conversations with employers and agencies</p>

        <div className="flex bg-white max-h-[50vh] h-[50vh] rounded shadow overflow-hidden border border-gray-300">
          <ConversationList
            selectedTab={state.selectedTab}
            setSelectedTab={(tab) => dispatch({ type: ACTIONS.SET_SELECTED_TAB, payload: tab })}
            selectedConversationId={state.selectedConversationId}
            setSelectedConversationId={(id) =>
              dispatch({ type: ACTIONS.SET_SELECTED_CONVERSATION, payload: id })
            }
            employerConversations={employerConversations}
            agencyConversations={agencyConversations}
            allUsers={allUsers}
            highlightedConversationId={state.highlightedConversationId}
            setConversationSummaries={(data) =>
              dispatch({ type: ACTIONS.SET_CONVERSATION_SUMMARIES, payload: data })
            }
            user_id={user_id}
          />

          <div className="w-2/3 flex flex-col justify-between p-6 relative">
            {state.selectedConversationId ? (
              <>
                <MessageHeader
                  selectedConversationId={state.selectedConversationId}
                  messages={messages}
                  user_id={user_id}
                  allUsers={allUsers}
                />

                <div ref={messageContainerRef} className="flex-grow space-y-3 overflow-y-auto mb-4">
                  {selectedMessages.slice(-state.visibleCount).map((msg, idx, arr) => {
                    const isOwnMessage = msg.sender_id === user_id;
                    const lastOwnIdx = [...arr].reverse().findIndex(
                      (m) => m.sender_id === user_id && m.is_read
                    );
                    const isLastOwnMessage =
                      lastOwnIdx !== -1 && arr.length - 1 - idx === lastOwnIdx;

                    return (
                      <ChatBubble
                        key={`msg_${msg.message_id ?? 'temp'}_${msg.sender_id}_${idx}`}
                        msg={msg}
                        isOwnMessage={isOwnMessage}
                        isLastOwnMessage={isLastOwnMessage}
                      />
                    );
                  })}
                </div>

                <MessageInput
                  text={state.text}
                  setText={(text) => dispatch({ type: ACTIONS.SET_TEXT, payload: text })}
                  file={state.file}
                  setFile={(file) => dispatch({ type: ACTIONS.SET_FILE, payload: file })}
                  onSend={handleSend}
                />
              </>
            ) : (
              <div className="text-gray-500 text-center mt-20">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
