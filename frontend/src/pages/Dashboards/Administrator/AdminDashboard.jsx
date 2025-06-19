import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';
import icons from '../../../assets/svg/Icons';
import Feedback from '../Feedback';
import UserVerification from './UserVerification';
import VerifiedUser from './VerifiedUser';
import JobPostVerification from './JobPostVerification';
import VerifiedJobPost from './VerifiedJobPost';
import UserFeedback from './UserFeedback';
import ReportedUser from './ReportedUser';

const SIDEBAR_WIDTH = 15;

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFullyClosed, setSidebarFullyClosed] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);


  const navigate = useNavigate();

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    setSidebarFullyClosed(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);

  };

  const handleFeedbackClose = () => {
    setFeedbackModalVisible(false);
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
    <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400">

       {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Navbar userType={"admin"} />
      </div>

      {/* Hamburger Sidebar */}
      {/* <div
        className={`
          fixed top-0 left-0 h-full  bg-gray-400 text-white z-50
          transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-40 flex flex-col
        `}
        style={{ width: `${SIDEBAR_WIDTH}rem` }}
        onTransitionEnd={() => {
          if (!sidebarOpen) setSidebarFullyClosed(true);
        }}
      > */}
        {/* Close Icon */}
        {/* <button
          onClick={handleSidebarClose}
          className="absolute top-5 right-5 text-3xl bg-transparent border-none cursor-pointer text-white"
          aria-label="Close sidebar"
        >
          &times;
        </button> */}

      <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">
        <div className=' flex flex-col items-center mt-25'>
          <div className="bg-gray-900 w-16 h-16 rounded-full flex justify-center items-center text-lg font-bold mb-5">
            {/* Name of admin */}
          </div>
          <p className='text-blue-900 font-bold'>Administrator</p>
        </div>

        <div className='flex mt-15'>
          <img src={icons.dashboard} alt="" className='mb-6 ml-5' />
          <h2 className="text-2xl font-bold mb-6 ml-5 text-black">Dashboard</h2>
        </div>

        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">
          <li className={`${activeComponent === 'UserVerification' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.user_verification} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('UserVerification')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              User Verification
            </button>
          </li>

          <li className={`${activeComponent === 'VerifiedUser' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.verified_user} alt="" className='ml-5' />
            <button
              onClick={() => setActiveComponent('VerifiedUser')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Verified User
            </button>
          </li>

          <li className={`${activeComponent === 'JobPostVerification' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.job_post_verification} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('JobPostVerification')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-md font-medium"
            >
              Job Post Verification
            </button>
          </li>

          <li className={`${activeComponent === 'VerifiedJobPost' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.verified_job_post} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('VerifiedJobPost')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Verified Job Post
            </button>
          </li>

          <li className={`${activeComponent === 'ReportedUser' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.reported_user} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('ReportedUser')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Reported User
            </button>
          </li>

          <li className={`${activeComponent === 'UserFeedback' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.user_feedback} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('UserFeedback')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              User Feedback
            </button>
          </li>

          <li className="mt-auto flex justify-center">
            <button
              onClick={handleLogout}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Sign out
            </button>
          </li>

        </ul>
      </div>

      {/* Hamburger Icon to open Sidebar */}
      {/* {!sidebarOpen && sidebarFullyClosed && (
        <button
          onClick={handleSidebarOpen}
          className="absolute top-5 left-10  text-3xl bg-transparent border-none cursor-pointer z-50"
          aria-label="Open sidebar"
        >
          &#9776;
        </button>
      )} */}

      {/* Main Content */}
      <div className="pt-[80px] pl-60">
        {activeComponent === 'UserVerification' ? (
          <UserVerification />
        ) : activeComponent === 'VerifiedUser' ? (
          <VerifiedUser />
        ) : activeComponent === 'JobPostVerification' ? (
          <JobPostVerification />
        ) : activeComponent === 'VerifiedJobPost' ? (
          <VerifiedJobPost />
        ) : activeComponent === 'ReportedUser' ? (
          <ReportedUser />
        ) : activeComponent === 'UserFeedback' ? (
          <UserFeedback />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
            <p className="text-gray-700 text-center">Welcome to your dashboard!</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModalVisible && <Feedback onClose={handleFeedbackClose} />}
    </div>
  )
}

export default AdminDashboard