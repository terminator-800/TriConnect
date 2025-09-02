import { useConversations } from '../../../../../hooks/CHAT';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import ChatTabs from './ChatTabs';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import ConversationList from './ConversationLists';

import { getTabFromLocalStorage, saveTabToLocalStorage, filterAndMapConversations } from './helper';

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    saveTabToLocalStorage(tab);
  };

  const { data: conversations = [] } = useConversations(ROLE.MANPOWER_PROVIDER);
  
  const displayedUsers = filterAndMapConversations(conversations, activeTab);

  return (
    <>
      <Sidebar />
      <div className="pl-110 pr-50 pt-50">
        <h1 className="text-5xl font-bold text-blue-900">Messages</h1>
        <p className="text-sm text-gray-600">
          Keep in touch with employers and agencies — track your job conversations here
        </p>
      </div>

      <div className="relative min-h-[75vh] bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-15">
        <div className="bg-white rounded shadow-md mx-auto h-[500px] flex flex-col border border-gray-300">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Section */}
            <div className="w-1/3 border-r border-gray-300">
              <ChatTabs
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                setSelectedUser={setSelectedUser}
              />
              <ConversationList
                users={displayedUsers}
                selectedUser={selectedUser}
                onSelect={setSelectedUser}
              />
            </div>

            {/* Chat Section */}
            <div className="flex flex-col flex-1">
              <ChatHeader selectedUser={selectedUser} />
              <ChatWindow selectedUser={selectedUser} />
              <MessageInput selectedUser={selectedUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
