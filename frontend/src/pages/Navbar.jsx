import { Link } from "react-router-dom";
import { useState } from "react";
import icons from "../assets/svg/Icons";
import { ROLE } from "../../utils/role";
import NotificationBell from "../components/NotificationBell";

const Navbar = ({ userType }) => {

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>

      {/* Guest */}
      {userType === "guest" && (
        <div className="flex justify-between items-center py-5 px-10 border border-b border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex gap-10">
            <Link className="font-bold" to="#">Features</Link>
            <a href="#how_it_works" className="font-bold">How it Works</a>
            <Link className="font-bold" to="#">Why Us</Link>
            <Link className="font-bold" to="#">Feedbacks</Link>
          </div>


          <div className="flex">
            <Link to={"/login"} className="text-blue-600 pl-3 p-1 pr-3 font-bold rounded m-2">Login</Link>
            <Link to={"/register"} className="bg-blue-900 font-bold p-1 rounded-3xl pl-3 pr-3 text-white m-2">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Guest */}
      {userType === "register" && (
        <div className="flex justify-between items-center py-5 px-10 border border-b border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>

          <div className="flex gap-10">
            <Link className="font-bold">Features</Link>
            <Link className="font-bold">How it Works</Link>
            <Link className="font-bold">Why Us</Link>
            <Link className="font-bold">Feedbacks</Link>
          </div>

          <div className="flex">
            <Link to={"/login"} className="text-blue-600 pl-3 p-1 pr-3 font-bold rounded m-2">Login</Link>
            <Link to={"/register"} className="bg-blue-900 font-bold p-1 rounded-3xl pl-3 pr-3 text-white m-2">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Login */}
      {userType === "login" && (
        <div className="flex justify-between items-center py-5 px-10 border border-b border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="flex gap-10">
            <Link className="font-bold">Features</Link>
            <Link className="font-bold">How it Works</Link>
            <Link className="font-bold">Why Us</Link>
            <Link className="font-bold">Feedbacks</Link>
          </div>

          <div className="flex">
            <Link to={"/login"} className="text-blue-600 pl-3 p-1 pr-3 font-bold rounded m-2">Login</Link>
            <Link to={"/register"} className="bg-blue-900 font-bold p-1 rounded-3xl pl-3 pr-3 text-white m-2">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Jobseeker */}
      {userType === ROLE.JOBSEEKER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={`/${ROLE.JOBSEEKER}`} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="flex justify-end items-center gap-15">

            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.JOBSEEKER} />
                Notifications
              </div>
            </div>

            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to={`/${ROLE.JOBSEEKER}/profile`} className="block px-4 py-2 text-black hover:bg-gray-100">
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
      {userType === ROLE.BUSINESS_EMPLOYER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="flex justify-end items-center gap-15">

            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.BUSINESS_EMPLOYER} />
                Notifications
              </div>
            </div>

            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to={`/${ROLE.BUSINESS_EMPLOYER}/profile`} className="block px-4 py-2 text-black hover:bg-gray-100">
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
      {userType === ROLE.INDIVIDUAL_EMPLOYER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="flex justify-end items-center gap-15">

            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.INDIVIDUAL_EMPLOYER} />
                Notifications
              </div>
            </div>

            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to={`/${ROLE.INDIVIDUAL_EMPLOYER}/profile`} className="block px-4 py-2 text-black hover:bg-gray-100">
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

      {/* Manpower Provider */}
      {userType === ROLE.MANPOWER_PROVIDER && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="flex justify-end items-center gap-15">

            <div className="relative flex">
              <div className="flex items-center font-bold cursor-pointer">
                <NotificationBell role={ROLE.MANPOWER_PROVIDER} />
                Notifications
              </div>
            </div>

            <div className="relative flex">
              <img src={icons.profile} alt="" className="mr-3" />
              <button
                onClick={toggleDropdown}
                className="font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <Link to={`/${ROLE.MANPOWER_PROVIDER}/profile`} className="block px-4 py-2 text-black hover:bg-gray-100">
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

      {/* Admininistrator */}
      {userType === ROLE.ADMINISTRATOR && (
        <div className="flex justify-between items-center py-5 px-10 border border-gray-300">
          <Link to={"/"} className="font-bold text-blue-900 flex items-center gap-3">
            <img src={icons.logo_triconnect} alt="" className="h-10" />
            TriConnect
          </Link>
          <div className="relative flex">
            <div className="flex items-center font-bold cursor-pointer">
              <NotificationBell role={ROLE.ADMINISTRATOR} />
              Notifications
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;