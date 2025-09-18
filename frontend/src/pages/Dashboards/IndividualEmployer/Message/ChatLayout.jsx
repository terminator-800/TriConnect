import { getTabFromLocalStorage, saveTabToLocalStorage, filterAndMapConversations } from './helper';
import { useConversations } from '../../../../../hooks/CHAT';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import ChatTabs from './ChatTabs';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import ConversationList from './ConversationLists';

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: conversations = [], isLoading, isError } = useConversations(ROLE.INDIVIDUAL_EMPLOYER);
  
  const displayedUsers = filterAndMapConversations(conversations, activeTab);

  const handleTabChange = (tab) => {
    saveTabToLocalStorage(tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <Sidebar />
      <div className="pl-110 pr-50 pt-50">
        <h1 className="text-2xl font-bold text-blue-900">Messages</h1>
        <p className="text-gray-600">
          Keep in touch with employers and agencies — track your job conversations here
        </p>
      </div>

      <div className="relative min-h-[75vh] bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-15">
        <div className="bg-white rounded shadow-md mx-auto h-[500px] flex flex-col border border-gray-300">
          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3">

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

            <div className="flex flex-col flex-1 border-l border-gray-300">
              <ChatHeader selectedUser={selectedUser} />
              <ChatWindow selectedUser={selectedUser} />
              <MessageInput selectedUser={selectedUser} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
