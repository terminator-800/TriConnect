import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';
import Feedback from '../Feedback';
import BusinessEmployerFindAgency from './BusinessEmployerFindAgency';
import ViewApplicant from './ViewApplicant';
import BusinessEmployerCreateJobPost from './BusinessEmployerCreateJobPost';
import BusinessEmployerManageJobPost from './BusinessEmployerManageJobPost';
import JobPostDetails from './JobPostDetails';
import BusinessEmployerMessage from './BusinessEmployerMessage';
import icons from '../../../assets/svg/Icons'

const SIDEBAR_WIDTH = 15;
const BusinessEmployerDashboard = () => {
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

  const handleFeedbackOpen = () => {
    setFeedbackModalVisible(true); // Show the feedback modal
  };

  const handleFeedbackClose = () => {
    setFeedbackModalVisible(false); // Hide the feedback modal
  };

  return (
    <div className="relative min-h-[120vh] bg-gradient-to-b from-white to-cyan-400">
      {/* Navbar */}
      <Navbar userType={"business_employer"} />

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

        {/* svg here */}
        <div className='flex'>
          <img src={icons.dashboard} alt="" className='mb-6 mt-30 ml-5' />
          <h2 className="text-2xl font-bold mb-6 mt-30 ml-5 text-black">Dashboard</h2>
        </div>

        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">
          <li className={`${activeComponent === 'JobPostDetail' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.job_post_details} alt="" className='ml-5 w-[27px]'/>
            <button
              onClick={() => setActiveComponent('JobPostDetail')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Job Post Details
            </button>
          </li>

          <li className={`${activeComponent === 'ManageJobPost' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.manage_job_post} alt="" className='ml-5' />
            <button
              onClick={() => setActiveComponent('ManageJobPost')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Manage Job Post
            </button>
          </li>

          <li className={`${activeComponent === 'BusinessEmployerCreateJobPost' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.create_job_post} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('BusinessEmployerCreateJobPost')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Create Job Post
            </button>
          </li>

          <li className={`${activeComponent === 'ViewApplicant' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.view_applicant} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('ViewApplicant')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              View Applicant
            </button>
          </li>

          <li className={`${activeComponent === 'FindAgency' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('FindAgency')}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
            >
              Find Agencies
            </button>
          </li>

          <li className={`${activeComponent === 'BusinessEmployerMessage' ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.message} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => setActiveComponent('BusinessEmployerMessage')}
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

      {/* Hamburger Icon to open Sidebar */}
      {!sidebarOpen && sidebarFullyClosed && (
        <button
          onClick={handleSidebarOpen}
          className="absolute top-5 left-10 text-3xl bg-transparent border-none cursor-pointer z-50"
          aria-label="Open sidebar"
        >
          &#9776;
        </button>
      )}

      {/* Main Content */}
      <div>
        {activeComponent === 'JobPostDetail' ? (
          <JobPostDetails />
        ) : activeComponent === 'ManageJobPost' ? (
          <BusinessEmployerManageJobPost />
        ) : activeComponent === 'BusinessEmployerCreateJobPost' ? (
          <BusinessEmployerCreateJobPost />
        ) : activeComponent === 'ViewApplicant' ? (
          <ViewApplicant />
        ) : activeComponent === 'FindAgency' ? (
          <BusinessEmployerFindAgency />
        ) : activeComponent === 'BusinessEmployerMessage' ? (
          <BusinessEmployerMessage />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Business Employer Dashboard</h1>
            <p className="text-gray-700 text-center">Welcome to your dashboard!</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModalVisible && <Feedback onClose={handleFeedbackClose} />}
    </div>
  )
}

export default BusinessEmployerDashboard