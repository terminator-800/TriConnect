import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../../../../hooks/useChats';
import { useBusinessEmployerProfile, useAllUsers } from '../../../../../hooks/useUserProfiles';
import Sidebar from '../Sidebar';
import ConversationList from './ConversationList';
import MessageHeader from './MessageHeader';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import { useSendMessage } from '../../../../../hooks/useSendMessage';
import messageApi from '../../../../../api/messageApi';
import socket from '../../../../../utils/socket';

const Message = () => {
  const messageContainerRef = useRef(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [selectedTab, setSelectedTab] = useState('jobseekers');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationSummaries, setConversationSummaries] = useState([]);
  const [highlightedConversationId, setHighlightedConversationId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const lastSeenRef = useRef([]);

  const { data: profile } = useBusinessEmployerProfile();
  const user_id = profile?.user_id;
  const mutation = useSendMessage('business-employer', user_id);
  const { messages } = useChat(selectedConversationId, user_id, 'business-employer');
  const { data: allUsers = [] } = useAllUsers();

  const jobseekerConversations = conversationSummaries.filter((msg) => {
    const user = allUsers.find((u) => u.user_id === (msg.sender_id === user_id ? msg.receiver_id : msg.sender_id));
    return user && !user.agency_name;
  });

  const agencyConversations = conversationSummaries.filter((msg) => {
    const user = allUsers.find((u) => u.user_id === (msg.sender_id === user_id ? msg.receiver_id : msg.sender_id));
    return user && user.agency_name;
  });

  const handleSend = () => {
    if ((!text && !file) || !selectedConversationId || !profile) return;

    const selectedConversation = conversationSummaries.find(
      (conv) => conv.conversation_id === selectedConversationId
    );

    if (!selectedConversation) {
      alert('No valid conversation found');
      return;
    }

    const receiver_id =
      selectedConversation.sender_id === user_id
        ? selectedConversation.receiver_id
        : selectedConversation.sender_id;

    mutation.mutate({
      receiver_id,
      message_text: text,
      file,
      conversation_id: selectedConversationId,
    });

    setText('');
    setFile(null);
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const conversations = await messageApi.fetchConversations('business-employer');
        const messages = await messageApi.fetchMessagesForConversations(
          'business-employer',
          conversations
        );

        const grouped = {};
        messages.forEach((msg) => {
          const id = msg.conversation_id;
          if (
            !grouped[id] ||
            new Date(msg.created_at) > new Date(grouped[id].created_at)
          ) {
            grouped[id] = {
              ...msg,
              is_read: msg.is_read
            };
          }
        });

        setConversationSummaries(
          Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const { conversation_id } = latestMessage;

    setConversationSummaries((prevSummaries) => {
      const existing = prevSummaries.find(
        (msg) => msg.conversation_id === conversation_id
      );

      if (
        existing &&
        new Date(existing.created_at).getTime() >= new Date(latestMessage.created_at).getTime()
      ) {
        return prevSummaries;
      }

      const withoutOld = prevSummaries.filter(
        (msg) => msg.conversation_id !== conversation_id
      );

      return [...withoutOld, latestMessage].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    });

    setHighlightedConversationId(conversation_id);
  }, [messages]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 50) {
        setVisibleCount((prev) => prev + 10);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversationId]);

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!messageContainerRef.current) return;
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages.length]);


  useEffect(() => {
    const markUnreadMessagesAsSeen = async () => {
      if (!messages.length || !selectedConversationId || !user_id) return;

      const unreadMessageIds = messages
        .filter(
          (msg) =>
            msg.conversation_id === selectedConversationId &&
            msg.sender_id !== user_id &&
            !msg.is_read
        )
        .map((msg) => msg.message_id);
      console.log(`🔵 Unread messages to mark as seen: ${unreadMessageIds.length}`, unreadMessageIds);
      // Avoid repeat
      const newUnseen = unreadMessageIds.filter(id => !lastSeenRef.current.includes(id));
      if (!newUnseen.length) return;
      console.log(`🔵 Unread messages to mark as seen: ${unreadMessageIds.length}`, unreadMessageIds);
      try {
        await messageApi.markAsSeen(newUnseen, 'business-employer', user_id);
        lastSeenRef.current = [...lastSeenRef.current, ...newUnseen];

        setConversationSummaries((prev) =>
          prev.map((summary) =>
            summary.conversation_id === selectedConversationId
              ? { ...summary, is_read: true }
              : summary
          )
        );
      } catch (error) {
        console.error('Failed to mark messages as seen:', error);
      }
    };

    markUnreadMessagesAsSeen();
  }, [messages, selectedConversationId, user_id]);


  useEffect(() => {
    if (!user_id) return;

    const handleIncomingMessage = (newMessage) => {
      console.log("🔥 Received via socket:", newMessage);
      if (newMessage.conversation_id === selectedConversationId) return;

      setConversationSummaries((prevSummaries) => {
        const existing = prevSummaries.find(
          (msg) => msg.conversation_id === newMessage.conversation_id
        );

        if (
          existing &&
          new Date(existing.created_at).getTime() >= new Date(newMessage.created_at).getTime()
        ) {
          return prevSummaries;
        }

        const withoutOld = prevSummaries.filter(
          (msg) => msg.conversation_id !== newMessage.conversation_id
        );

        return [...withoutOld, newMessage].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      setHighlightedConversationId(newMessage.conversation_id);
    };

    const handleMessagesSeen = ({ conversation_id, message_ids }) => {
      if (conversation_id !== selectedConversationId) return;

      // Update seen status in chat bubbles
      setConversationSummaries((prevSummaries) =>
        prevSummaries.map((summary) =>
          summary.conversation_id === conversation_id
            ? { ...summary, is_read: true }
            : summary
        )
      );
    };

    // socket.on('receiveMessage', handleIncomingMessage);
    // socket.on('messagesSeen', handleMessagesSeen); // ✅ listen to real-time seen updates

    // return () => {
    //   socket.off('receiveMessage', handleIncomingMessage);
    //   socket.off('messagesSeen', handleMessagesSeen); // ✅ cleanup
    // };
  }, [selectedConversationId, user_id]);

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
        <h1 className="text-5xl font-bold text-blue-900">Messages</h1>
        <p className="mb-6">View and manage conversations with jobseekers and agencies</p>

        <div className="flex bg-white max-h-[50vh] h-[50vh] rounded shadow overflow-hidden border border-gray-300">
          <ConversationList
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
            jobseekerConversations={jobseekerConversations}
            agencyConversations={agencyConversations}
            allUsers={allUsers}
            highlightedConversationId={highlightedConversationId}
            setConversationSummaries={setConversationSummaries}
            user_id={user_id}
          />

          <div className="w-2/3 flex flex-col justify-between p-6 relative">
            {selectedConversationId ? (
              <>
                <MessageHeader
                  selectedConversationId={selectedConversationId}
                  messages={messages}
                  user_id={user_id}
                  allUsers={allUsers}
                />

                <div
                  ref={messageContainerRef}
                  className="flex-grow space-y-3 overflow-y-auto mb-4"
                >
                  {messages
                    .filter((msg) => msg.conversation_id === selectedConversationId)
                    .slice(-visibleCount)
                    .map((msg, idx, arr) => {
                      const isOwnMessage = msg.sender_id === user_id;
                      const lastOwnIdx = [...arr].reverse().findIndex(
                        (m) => m.sender_id === user_id && m.is_read
                      );
                      const isLastOwnMessage = lastOwnIdx !== -1 && arr.length - 1 - idx === lastOwnIdx;

                      return (
                        <ChatBubble
                          key={`${msg.message_id ?? 'temp'}_${msg.sender_id}_${new Date(msg.created_at).getTime()}_${idx}`}
                          msg={msg}
                          isOwnMessage={isOwnMessage}
                          isLastOwnMessage={isLastOwnMessage}
                        />
                      );
                    })}
                </div>

                <MessageInput
                  text={text}
                  setText={setText}
                  file={file}
                  setFile={setFile}
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
