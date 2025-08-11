import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROLE } from '../../../../utils/role';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';
import Feedback from '../../../components/Feedback';
import { useLogout } from '../../../../hooks/useLogout';

const Sidebar = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isLoading: isLoggingOut } = useLogout();

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
        <Navbar userType={ROLE.MANPOWER_PROVIDER} />
      </div>

      {/* Sidebar */}
      <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/dashboard`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.dashboard} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/dashboard`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Dashboard
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/jobs`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_job} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/jobs`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Find Jobs
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/manage`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/manage`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Manage Job Post
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/create`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/create`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Create Job Post
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/view`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.view_applicant} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/view`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              View Applicant
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/message`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.message} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/message`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Messages
            </button>
          </li>

          <li className="mt-auto flex justify-center">
            <button
              onClick={handleFeedbackOpen}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Add Feedback
            </button>
          </li>

          <li className="mt-0 flex justify-center">
            <button
              onClick={logout}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </li>

        </ul>
      </div>

      {/* Feedback Modal */}
      {feedbackModalVisible && (
        <Feedback
          onClose={handleFeedbackClose}
          role={ROLE.MANPOWER_PROVIDER}
        />
      )}
    </>
  );
};

export default Sidebar;
