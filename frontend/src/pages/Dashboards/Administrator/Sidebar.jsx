import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';

const AdminSidebar = () => {

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

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Navbar userType={"admin"} />
            </div>

            {/* Sidebar */}
            <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

                <div className=' flex flex-col items-center mt-30 mb-10'>
                    <div className="bg-gray-900 w-16 h-16 rounded-full flex justify-center items-center text-lg font-bold mb-5">
                    </div>
                    <p className='text-blue-900 font-bold italic'>Administrator</p>
                </div>

                <div className="flex ml-5">
                    <img src={icons.dashboard} alt="Dashboard Icon" className="w-[27px]" />
                    <h2 className="text-2xl font-bold ml-5 text-black">Dashboard</h2>
                </div>

                <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mt-8">
                    <li className={`${location.pathname === '/admin/verification' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.user_verification} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/verification')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            User Verification
                        </button>
                    </li>

                    <li className={`${location.pathname === '/admin/verified' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.verified_user} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/verified')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Verified User
                        </button>
                    </li>

                    <li className={`${location.pathname === '/admin/job-post-verification' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.job_post_verification} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/job-post-verification')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Job Post Verification
                        </button>
                    </li>

                    <li className={`${location.pathname === '/admin/verified-job-post' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.verified_job_post} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/verified-job-post')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Verified Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname === '/admin/reported' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.reported_user} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/reported')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Reported User
                        </button>
                    </li>

                    <li className={`${location.pathname === '/admin/feedback' ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.user_feedback} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate('/admin/feedback')}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            User Feedback
                        </button>
                    </li>

                    <div className="mt-auto mb-4 flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </ul>
            </div>
        </>
    );
};

export default AdminSidebar;
