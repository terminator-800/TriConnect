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
        <Navbar userType={ROLE.JOBSEEKER} />
      </div>

      {/* Sidebar */}
      <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">
          
          <li className={`${location.pathname.includes(`/${ROLE.JOBSEEKER}/jobs`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_job} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.JOBSEEKER}/jobs`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Find Jobs
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.JOBSEEKER}/agencies`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.JOBSEEKER}/agencies`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Find Agencies
            </button>
          </li>

          <li className={`${location.pathname.includes(`/${ROLE.JOBSEEKER}/message`) ? 'bg-gray-500' : ''} flex`}>
            <img src={icons.message} alt="" className='ml-5 w-[27px]' />
            <button
              onClick={() => navigate(`/${ROLE.JOBSEEKER}/message`)}
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
          role={ROLE.JOBSEEKER}
        />
      )}
    </>
  );
};

export default Sidebar;
