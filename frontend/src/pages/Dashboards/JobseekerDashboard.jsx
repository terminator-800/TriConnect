import React, { useState } from 'react'

const SIDEBAR_WIDTH = 15; // 10rem (w-40 in Tailwind)

const JobseekerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFullyClosed, setSidebarFullyClosed] = useState(true);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    setSidebarFullyClosed(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    // Hamburger will reappear after transition ends
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar */}
       <div
        className={`
          fixed top-0 left-0 right-0 h-16 bg-blue-300 flex items-center px-6 shadow z-40
          transition-all duration-300
          ${sidebarOpen ? 'ml-80' : 'ml-0'}
        `}
        style={{ marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}rem` : 0 }}
      >
        <span className="text-lg font-semibold">Navbar</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-50 p-6
          transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-40 flex flex-col
        `}
        style={{ width: `${SIDEBAR_WIDTH}rem` }}
        onTransitionEnd={() => {
          if (!sidebarOpen) setSidebarFullyClosed(true);
        }}
      >
        {/* Close Icon */}
        <button
          onClick={handleSidebarClose}
          className="absolute top-5 right-5 text-3xl bg-transparent border-none cursor-pointer text-white"
          aria-label="Close sidebar"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 mt-30 ml-5">Dashboard</h2>
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col ml-5">
          <li><a href="#" className="text-white hover:text-gray-300">Find Agencies</a></li>
          <li><a href="#" className="text-white hover:text-gray-300">Messages</a></li>
          <li className="mt-auto flex justify-center">
            <a href="#" className="text-white hover:text-gray-300">Sign out</a>
          </li>
        </ul>
      </div>  

      {/* Hamburger Icon to open Sidebar */}
     {!sidebarOpen && sidebarFullyClosed && (
  <button
    onClick={handleSidebarOpen}
    className="absolute top-20 left-5 text-3xl bg-transparent border-none cursor-pointer z-50"
    aria-label="Open sidebar"
  >
    &#9776;
  </button>
)}

      {/* Main Content */}
      
      <div  className={` transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} flex justify-center items-center h-screen `}>

        
        <div>
          <h1 className="text-3xl font-bold mb-4">Jobseeker Dashboard</h1>
           <p className="text-gray-700">Welcome to your dashboard!</p>
        </div>
        
      </div>
    </div>
  )
}

export default JobseekerDashboard