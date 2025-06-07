import { Link } from "react-router-dom";
import React, { useState } from "react";

const Navbar = ({ userType }) => {

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>

      {userType === "guest" && (
        <>
          <Link className="text-2xl font-bold">Features</Link>
          <Link className="text-2xl font-bold">How it Works</Link>
          <Link className="text-2xl font-bold">Why Us</Link>
          <Link className="text-2xl font-bold">Feedbacks</Link>
          <div className="flex">
            <Link to={"/login"} className="text-blue-600 pl-3 p-1 pr-3 font-bold rounded m-2">Login</Link>
            <Link to={"/register"} className="bg-blue-900 font-bold p-1 rounded-3xl pl-3 pr-3 text-white m-2">Sign Up</Link>
          </div>
        </>
      )}

      {userType === "jobseeker" && (
        <div className="flex justify-between items-center pt-5 pb-5 pl-20 pr-20 border-b-2 border-gray-300">
          <h1 className="font-bold text-2xl text-blue-900">TriConnect</h1>
          <div className="flex justify-end items-center gap-15">
            <Link to="/jobseeker/notifications" className="text-2xl font-bold">
              Notifications
            </Link>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-2xl font-bold focus:outline-none cursor-pointer"
              >
                Profile
              </button>
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
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

      {userType === "employer" && (
        <>
          <Link to="/post-job" className="text-2xl font-bold">Post a Job</Link>
          <Link to="/candidates" className="text-2xl font-bold">Candidates</Link>
          <Link to="/analytics" className="text-2xl font-bold">Analytics</Link>
        </>
      )}

      {userType === "admin" && (
        <>
          <Link to="/users" className="text-2xl font-bold">Manage Users</Link>
          <Link to="/reports" className="text-2xl font-bold">Reports</Link>
          <Link to="/settings" className="text-2xl font-bold">Settings</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;