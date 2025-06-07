import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';
import FindJob from './FindJob';
import FindAgency from './FindAgency';
import Message from './Message';

const SIDEBAR_WIDTH = 15;

const JobseekerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFullyClosed, setSidebarFullyClosed] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    setSidebarFullyClosed(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/logout', {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Logged out successfully');
        navigate("/");
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen); // Toggle dropdown visibility
  };

  const handleProfileOptionClick = (option) => {
    if (option === 'View Profile') {
      navigate('/jobseeker/profile');
    } else if (option === 'Edit Profile') {
      navigate('/edit-profile');
    } else if (option === 'Settings') {
      navigate('/settings');
    }
    setProfileDropdownOpen(false); // Close dropdown after selection
  };

  const handlefeedback = async () => {
    // Feedback logic here
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400">

      {/* Navbar */}

      <Navbar userType={"jobseeker"}/>
      <div className="relative">
        
        
        {profileDropdownOpen && (
          <div className="absolute right-5 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
            <ul className="list-none p-2">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProfileOptionClick('View Profile')}
              >
                View Profile
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProfileOptionClick('Edit Profile')}
              >
                Edit Profile
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProfileOptionClick('Settings')}
              >
                Settings
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-400 text-white z-50 p-0
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

        <h2 className="text-2xl font-bold mb-6 mt-30 ml-14 text-black">Dashboard</h2>
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">

          <li className={`${activeComponent === 'FindJob' ? 'bg-gray-500' : ''}`}>
            <button
              onClick={() => setActiveComponent('FindJob')}
              className="text-black hover:text-gray-300 ml-14 bg-transparent border-none cursor-pointer p-2"
            >
              Find Jobs
            </button>
          </li>

          <li className={`${activeComponent === 'FindAgency' ? 'bg-gray-500' : ''}`}>
            <button
              onClick={() => setActiveComponent('FindAgency')}
              className="text-black hover:text-gray-300 ml-14 bg-transparent border-none cursor-pointer p-2"
            >
              Find Agencies
            </button>
          </li>

          <li className={`${activeComponent === 'Message' ? 'bg-gray-500' : ''}`}>
            <button
              onClick={() => setActiveComponent('Message')}
              className="text-black hover:text-gray-300 ml-14 bg-transparent border-none cursor-pointer p-2"
            >
              Messages
            </button>
          </li>

          <li className="mt-auto flex justify-center">
            <button
              onClick={handlefeedback}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2"
            >
              Add Feedback
            </button>
          </li>

          <li className="mt-0 flex justify-center">
            <button
              onClick={handleLogout}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2"
            >
              Sign out
            </button>
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
      <div>
        {activeComponent === 'FindJob' ? (
          <FindJob />
        ) : activeComponent === 'FindAgency' ? (
          <FindAgency />
        ) : activeComponent === 'Message' ? (
          <Message />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Jobseeker Dashboard</h1>
            <p className="text-gray-700 text-center">Welcome to your dashboard!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default JobseekerDashboard;