import { Link } from "react-router-dom";
import { useState } from "react";
import icons from "../assets/svg/Icons";

const Navbar = ({ userType }) => {

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>

      {/* Guest */}
      {userType === "guest" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-60 pr-60 border-b-2 border-gray-300">
          <Link to={"/"} className="font-bold text-2xl text-blue-900">TriConnect</Link>
          <Link className="text-2xl font-bold">Features</Link>
          <Link className="text-2xl font-bold">How it Works</Link>
          <Link className="text-2xl font-bold">Why Us</Link>
          <Link className="text-2xl font-bold">Feedbacks</Link>
          <div className="flex">
            <Link to={"/login"} className="text-blue-600 pl-3 p-1 pr-3 font-bold rounded m-2">Login</Link>
            <Link to={"/register"} className="bg-blue-900 font-bold p-1 rounded-3xl pl-3 pr-3 text-white m-2">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Login */}
       {userType === "login" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-60 pr-60 border-b-2 border-gray-300">
          <Link to={"/"} className="font-bold text-2xl text-blue-900">TriConnect</Link>
          <Link className="text-2xl font-bold">Features</Link>
          <Link className="text-2xl font-bold">How it Works</Link>
          <Link className="text-2xl font-bold">Why Us</Link>
          <Link className="text-2xl font-bold">Feedbacks</Link>
         
        </div>
      )}

      {/* Jobseeker */}
      {userType === "jobseeker" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-60 pr-60 border-b-2 border-gray-300">
          <h1 className="font-bold text-2xl text-blue-900">TriConnect</h1>
          <div className="flex justify-end items-center gap-15">

            <div className="relative flex">
              <button className="flex items-center text-2xl font-bold cursor-pointer">
                <img src={icons.notification_bell} alt="Notification Icon" className="w-6 h-6 mr-2" />
                Notifications
              </button>
            </div>


            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="text-2xl font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to="/jobseeker/profile" className="block px-4 py-2 text-black hover:bg-gray-100">
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Business Employer */}
      {userType === "business_employer" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-60 pr-60 border-b-2 border-gray-300">
          <h1 className="font-bold text-2xl text-blue-900">TriConnect</h1>
          <div className="flex justify-end items-center gap-15">

             <div className="relative flex">
              <button className="flex items-center text-2xl font-bold cursor-pointer">
                <img src={icons.notification_bell} alt="Notification Icon" className="w-6 h-6 mr-2" />
                Notifications
              </button>
            </div>
            
            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="text-2xl font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to="/jobseeker/profile" className="block px-4 py-2 text-black hover:bg-gray-100">
                    View Profile
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Message
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Individual Employer */}
      {userType === "individual_employer" && (
        <>
          <Link to="/post-job" className="text-2xl font-bold">Post a Job</Link>
          <Link to="/candidates" className="text-2xl font-bold">Candidates</Link>
          <Link to="/analytics" className="text-2xl font-bold">Analytics</Link>
        </>
      )}

      {/* Admininistrator */}
      {userType === "admin" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-60 pr-60 border-b-2 border-gray-300">
          <Link to={"/"} className="font-bold text-2xl text-blue-900">TriConnect</Link>
           <div className="relative flex">
              <button className="flex items-center text-2xl font-bold cursor-pointer">
                <img src={icons.notification_bell} alt="Notification Icon" className="w-6 h-6 mr-2" />
                Notifications
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;