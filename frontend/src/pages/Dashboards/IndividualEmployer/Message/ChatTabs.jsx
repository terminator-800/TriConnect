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
        onClick={() => handleTabClick('jobseeker')}
        className={`cursor-pointer ${tabClasses('jobseeker')}`}
      >
        Jobseeker's
      </button>
      <button
        onClick={() => handleTabClick('manpower-provider')}
        className={`cursor-pointer ${tabClasses('manpower-provider')}`}
      >
        Agencies
      </button>
    </div>

  );
};

export default ChatTabs;
