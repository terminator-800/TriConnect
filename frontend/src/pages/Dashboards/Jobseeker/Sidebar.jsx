import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';
import Feedback from '../Feedback';

const Sidebar = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
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

  const handleFeedbackOpen = () => {
    setFeedbackModalVisible(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackModalVisible(false);
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={"jobseeker"} />
      </div>

      {/* Sidebar */}
      <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

        <div className='flex mb-6 mt-30 ml-5'>
          <img src={icons.dashboard} alt="" />
          <h2 className="text-2xl font-bold ml-5 text-black">Dashboard</h2>
        </div>

        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">
          <li className={`${location.pathname.includes('/jobseeker/jobs') ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_job} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate('/jobseeker/jobs')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Find Jobs
            </button>
          </li>

          <li className={`${location.pathname.includes('/jobseeker/agencies') ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate('/jobseeker/agencies')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Find Agencies
            </button>
          </li>

          <li className={`${location.pathname.includes('/jobseeker/message') ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.message} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate('/jobseeker/message')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Messages
            </button>
          </li>

          <li className="mt-auto flex justify-center">
            <button
              onClick={handleFeedbackOpen}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Add Feedback
            </button>
          </li>

          <li className="mt-0 flex justify-center">
            <button
              onClick={handleLogout}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>

      {/* Feedback Modal */}
      {feedbackModalVisible && <Feedback onClose={handleFeedbackClose} />}
    </>
  );
};

export default Sidebar;
