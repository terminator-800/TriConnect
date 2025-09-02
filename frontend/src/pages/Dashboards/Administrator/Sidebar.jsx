import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { ROLE } from '../../../../utils/role';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';

const AdminSidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { logout, isLoading: isLoggingOut } = useLogout();

    const handleLogout = async () => {
        if (isLoggingOut) return; 
        await logout();
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <Navbar userType={ROLE.ADMINISTRATOR} />
            </div>

            {/* Sidebar */}
            <div className="fixed h-full bg-gray-400 text-white p-0 w-60 flex flex-col z-40">

                <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/verification` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.user_verification} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verification`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            User Verification
                        </button>
                    </li>

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/verified` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.verified_user} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verified`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Verified User
                        </button>
                    </li>

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/job-post-verification` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.job_post_verification} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/job-post-verification`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Job Post Verification
                        </button>
                    </li>

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/verified-job-post` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.verified_job_post} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verified-job-post`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Verified Job Post
                        </button>
                    </li>

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/reported` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.reported_user} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/reported`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            Reported User
                        </button>
                    </li>

                    <li className={`${location.pathname === `/${ROLE.ADMINISTRATOR}/feedback` ? 'bg-gray-500' : ''} flex`}>
                        <img src={icons.user_feedback} alt="" className="ml-5 w-[27px]" />
                        <button
                            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/feedback`)}
                            className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
                        >
                            User Feedback
                        </button>
                    </li>

                    <div className="mt-auto mb-4 flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 text-xl font-medium"
                        >
                            {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </button>
                    </div>
                </ul>
            </div>
        </>
    );
};

export default AdminSidebar;
