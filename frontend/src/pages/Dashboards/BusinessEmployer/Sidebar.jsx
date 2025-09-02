import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { useState } from 'react'
import { ROLE } from '../../../../utils/role';
import icons from '../../../assets/svg/Icons'
import Navbar from '../../Navbar';
import Feedback from '../../../components/Feedback';


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

     const handleLogout = async () => {
        if (isLoggingOut) return; 
        await logout();
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Navbar userType={ROLE.BUSINESS_EMPLOYER} />
            </div>

            {/* Sidebar */}
            <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

                <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">
                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/dashboard`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.dashboard} alt="" className='w-[27px] ml-5' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/dashboard`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Dashboard
                        </button>
                    </li>

                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/manage`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.manage_job_post} alt="" className='ml-5' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/manage`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2  font-medium"
                        >
                            Manage Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/create`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.create_job_post} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/create`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2  font-medium"
                        >
                            Create Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/view`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.view_applicant} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/view`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            View Applicant
                        </button>
                    </li>

                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/find`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/find`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Find Agencies
                        </button>
                    </li>

                    <li className={`${location.pathname.includes(`/${ROLE.BUSINESS_EMPLOYER}/message`) ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.message} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate(`/${ROLE.BUSINESS_EMPLOYER}/message`)}
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
                            onClick={handleLogout}
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
                    role={ROLE.BUSINESS_EMPLOYER} 
                />
            )}
        </>
    );

}


export default Sidebar