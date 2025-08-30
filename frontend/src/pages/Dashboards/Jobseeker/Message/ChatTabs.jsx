const ChatTabs = ({ activeTab, setActiveTab }) => {

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabClasses = (tab) =>
    `w-1/2 text-center py-2 font-semibold border-b-2 transition-colors duration-150 ${activeTab === tab
      ? 'border-blue-700 text-black'
      : 'border-transparent text-gray-500'
    }`;

  return (
    <div className="flex border-b border-gray-300 bg-white">
      <button
        onClick={() => handleTabClick('employer')}
        className={`${tabClasses('employer')} cursor-pointer`}
      >
        Employer's
      </button>
      <button
        onClick={() => handleTabClick('manpower-provider')}
        className={`${tabClasses('manpower-provider')} cursor-pointer`}
      >
        Agencies
      </button>
    </div>
  );
};

export default ChatTabs;
