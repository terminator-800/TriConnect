import { useState } from 'react'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import icons from '../../../assets/svg/Icons'
import Navbar from '../../Navbar';
import Feedback from '../Feedback';


const Sidebar = () => {
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        setFeedbackModalVisible(true);
    };


    const handleFeedbackClose = () => {
        setFeedbackModalVisible(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Navbar userType={"business_employer"} />
            </div>

            {/* Sidebar */}
            <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

                {/* svg here */}
                <div className='flex'>
                    <img src={icons.dashboard} alt="" className='mb-6 mt-30 ml-5' />
                    <h2 className="text-2xl font-bold mb-6 mt-30 ml-5 text-black">Dashboard</h2>
                </div>

                <ul className="list-none p-0 space-y-4 flex-1 flex flex-col">
                    <li className={`${location.pathname.includes('/business-employer/post') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.job_post_details} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate('/business-employer/post')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Job Post Details
                        </button>
                    </li>

                    <li className={`${location.pathname.includes('/business-employer/manage') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.manage_job_post} alt="" className='ml-5' />
                        <button
                            onClick={() => navigate('/business-employer/manage')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Manage Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname.includes('/business-employer/create') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.create_job_post} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate('/business-employer/create')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Create Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname.includes('/business-employer/view') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.view_applicant} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate('/business-employer/view')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            View Applicant
                        </button>
                    </li>

                    <li className={`${location.pathname.includes('/business-employer/find') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.find_agency} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate('/business-employer/find')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Find Agencies
                        </button>
                    </li>

                    <li className={`${location.pathname.includes('/business-employer/message') ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.message} alt="" className='ml-5 w-[27px]' />
                        <button
                            onClick={() => navigate('/business-employer/message')}
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

}


export default Sidebar