import { useEffect, useRef, useState } from 'react';
import { useMarkMessagesAsSeen } from './helper'
import { useMessageHistory } from '../../../../../hooks/CHAT';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useQueryClient } from '@tanstack/react-query';
import { getInitials } from './helper';
import { useChatRoom } from '../../../../../hooks/useChatRoom';
import { useSocket } from '../../../../../hooks/useSocket';
import { ROLE } from '../../../../../utils/role';
import icons from '../../../../assets/svg/Icons';
import socket from '../../../../../utils/socket';

const ChatWindow = ({ selectedUser }) => {
  const endRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const queryClient = useQueryClient();

  const { data: profileData } = useUserProfile(ROLE.JOBSEEKER);
  const currentUserId = profileData?.user_id;

  const { conversation_id = null } = selectedUser || {};

  const { data: messages = [], isLoading, isError } = useMessageHistory(ROLE.JOBSEEKER, conversation_id);

  // Initialize socket connection
  useSocket(currentUserId, ROLE.JOBSEEKER);

  // Join conversation room
  useChatRoom(conversation_id);

  // 🔁 Automatically mark messages as seen
  useMarkMessagesAsSeen({
    role: ROLE.JOBSEEKER,
    conversation_id,
    messages,
    currentUserId,
  });

  // Real-time message listener
  useEffect(() => {
    if (!conversation_id) return;

    const handleNewMessage = (newMessage) => {

      if (Number(newMessage.conversation_id) === Number(conversation_id)) {
        queryClient.invalidateQueries({
          queryKey: ['messages', ROLE.JOBSEEKER, conversation_id]
        });

        queryClient.invalidateQueries({
          queryKey: ['conversations', ROLE.JOBSEEKER]
        });
      }
    };

    const handleMessagesSeen = (data) => {

      if (Number(data.conversation_id) === Number(conversation_id)) {
        queryClient.invalidateQueries({
          queryKey: ['messages', ROLE.JOBSEEKER, conversation_id]
        });
      }
    };

    // Listen for new messages
    socket.on('receiveMessage', handleNewMessage);

    // Listen for messages seen updates
    socket.on('messagesSeen', handleMessagesSeen);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.off('messagesSeen', handleMessagesSeen);
    };
  }, [conversation_id, queryClient]);

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    // 🆕 Added fixed width (max-w-[800px]) and full height scrollable area (overflow-y-auto)
    <div
      className="flex-1 overflow-y-auto bg-white 
    
    rounded-lg
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
    max-[769px]:max-w-[60vw]
    max-[660px]:max-w-[55vw]
    max-[426px]:max-w-[50vw]
    max-[426px]:pr-0
    max-[769px]:p-0
    max-[769px]:m-0

    "
    >
      {isLoading && <div className="text-gray-400 text-center">Loading messages...</div>}
      {isError && <div className="text-red-500 text-center">Failed to load messages.</div>}
      {!isLoading && !isError && messages.length === 0 && (
        <div className="text-gray-400 text-center">No messages yet.</div>
      )}

      <div className="flex-1 bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col justify-end min-h-[50vh]
          
          max-[769px]:px-2
          max-[769px]:py-0
           max-[426px]:px-2
           max-[376px]:px-2
        ">
          <ul className="flex flex-col space-y-4
          ">
            {messages.map((msg, index) => {
              const isSender = Number(msg.sender_id) === Number(currentUserId);
              const senderAvatar = selectedUser?.authorized_profile;
              const senderInitials = getInitials(selectedUser?.authorized_person || 'unkown');
              const alignment = isSender ? 'justify-end' : 'justify-start';
              const bubbleStyle = isSender
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none';

              const isLastSenderMessage =
                isSender && index === messages.findLastIndex((m) => Number(m.sender_id) === Number(currentUserId));

              return (
                <li key={msg.message_id || `msg-${index}`} className={`flex ${alignment} items-end`}>

                  {/* AUTHORIZED PERSONEL */}
                  {!isSender && (
                    <div className="shrink-0 w-8 h-8 rounded-full mr-2 text-xs font-semibold overflow-hidden flex items-center justify-center bg-gray-400 text-white">
                      {senderAvatar ? (
                        <img
                          src={senderAvatar}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        senderInitials
                      )}
                    </div>
                  )}


                  <div className="flex flex-col items-start 
                    
                  ">
                    <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${bubbleStyle}`}>
                      {msg.message_type === 'file' && msg.file_url && (
                        <img
                          src={`${msg.file_url}`}
                          alt="Sent file"
                          className="w-48 h-auto rounded-lg border border-gray-300 cursor-pointer hover:opacity-80"
                          onClick={() => setPreviewImage(`${msg.file_url}`)}
                        />
                      )}
                      <div className="wrap-break-word whitespace-pre-
                        max-[769px]:max-w-50
                        max-[601px]:max-w-40
                        max-[426px]:max-w-25
                        max-[511px]:max-w-25
                        max-[376px]:max-w-15
                        max-[321px]:max-w-5

                      ">
                        <div>{msg.message_text || 'No message yet'}</div>
                      </div>
                    </div>

                    <div
                      className={`text-xs mt-1 ${isSender ? 'text-right self-end text-gray-500' : 'text-left self-start text-gray-500'}`}
                     >
                      <div>sent {msg.created_at}</div>
                      {isLastSenderMessage && !!msg.is_read && (
                        <div className="text-xs text-blue-500 mt-1">Seen</div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            <div ref={endRef} />
          </ul>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-full max-h-full border border-gray-300">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl cursor-pointer"
              onClick={() => setPreviewImage(null)}
            >
              <img src={icons.close} alt="Close" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatWindow;
