import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
const SIDEBAR_WIDTH = 15;

const AdminDashboard = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFullyClosed, setSidebarFullyClosed] = useState(true);
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
        navigate("/login");
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

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
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">
          <li><a href="#" className="text-white hover:text-gray-300 ml-5">Find Agencies</a></li>
          <li><a href="#" className="text-white hover:text-gray-300 ml-5">Messages</a></li>
          <li className="mt-auto flex justify-center">
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
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

      
        <div className="transition-all duration-300 ml-0 flex justify-center items-center h-screen">
          <div>
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-700">Welcome to your dashboard!</p>
          </div>
        </div>
      
    </div>
  )
}

export default AdminDashboard