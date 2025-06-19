import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BusinessEmployerForm from './BusinessEmployerForm';
import Navbar from '../../Navbar';
import Sidebar from './Sidebar';
import icons from '../../../assets/svg/Icons';

const BusinessEmployerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const hasFetched = useRef(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // if (hasFetched.current) return;
    // hasFetched.current = true;

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/business-employer/profile', {
          withCredentials: true,
        });


        // console.log(profileData.role);

        if (response.status === 200) {
          setProfileData(response.data);

        } else if (response.status === 400) {
          setError('Bad request. Please try again.');
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [refreshTrigger]);

  const openFormm = () => {
    setShowForm(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Sidebar />
      <div className="relative min-h-[140vh]  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-40 ">
        <div className="bg-white shadow-md rounded p-6 w-full max-w-7xl border border-gray-300">

          <div>
            {/* ✅ Conditional rendering based on submission status */}
            {profileData.is_verified ? (
              <>

              
                <p className="text-green-600 font-semibold mt-4">Verified ✅</p>
              </>
            ) : profileData.is_rejected ? (

              <div className="flex items-center justify-between w-full">
                {/* Yellow Box */}
                <div className="bg-yellow-200 p-6 rounded-md shadow-md flex justify-between items-center w-full max-w-5xl">
                  {/* Left Section: Icon + Text */}
                  <div className="flex gap-4 items-center">
                    {/* ✅ Icon Vertically Centered */}
                    <img src={icons.not_verified} alt="Not Verified" className="w-11" />

                    <div>
                      <h1 className="font-bold text-2xl text-yellow-900">Submitted Requirements Rejected</h1>
                      <p className="text-yellow-900 max-w-md">
                        Your verification details was rejected due to inaccurate information or invalid documents, please review and resubmit the correct details and files.
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    className="bg-green-600 text-white px-5 py-2 rounded-2xl cursor-pointer"
                    onClick={openFormm}
                  >
                    Verify Now
                  </button>
                </div>

                {/* Profile Circle - Far Right */}
                <div className="ml-6">
                  <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                    Profile
                  </div>
                </div>
              </div>

            ) : profileData.is_submitted ? (
              <div className="flex items-center justify-between w-full">
                {/* Yellow Box */}
                <div className="bg-yellow-200 p-6 rounded-md shadow-md flex justify-between items-center w-full max-w-5xl">
                  {/* Left Section: Icon + Text */}
                  <div className="flex gap-4 items-center">
                    {/* ✅ Icon Vertically Centered */}
                    <img src={icons.not_verified} alt="Not Verified" className="w-11" />

                    <div>
                      <h1 className="font-bold text-2xl text-yellow-900">Waiting for verification...</h1>
                      <p className="text-yellow-900 max-w-md">
                        Wait for 3 days for the administrator to verify
                      </p>
                    </div>
                  </div>                 
                </div>

                {/* Profile Circle - Far Right */}
                <div className="ml-6">
                  <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                    Profile
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                {/* Yellow Box */}
                <div className="bg-yellow-200 p-6 rounded-md shadow-md flex justify-between items-center w-full max-w-5xl">
                  {/* Left Section: Icon + Text */}
                  <div className="flex gap-4 items-center">
                    {/* ✅ Icon Vertically Centered */}
                    <img src={icons.not_verified} alt="Not Verified" className="w-11" />

                    <div>
                      <h1 className="font-bold text-2xl text-yellow-900">Account Not Verified</h1>
                      <p className="text-yellow-900 max-w-md">
                        Please verify your email and complete your profile to unlock all features.
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    className="bg-green-600 text-white px-5 py-2 rounded-2xl cursor-pointer"
                    onClick={openFormm}
                  >
                    Verify Now
                  </button>
                </div>

                {/* Profile Circle - Far Right */}
                <div className="ml-6">
                  <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                    Profile
                  </div>
                </div>
              </div>
            )}
          </div>



        </div>

        {showForm && (
          <BusinessEmployerForm
            onClose={() => setShowForm(false)}
            onSubmitSuccess={() => {
              setShowForm(false);
              setRefreshTrigger(prev => prev + 1);
            }}
          />
        )}


      </div>
    </>
  );
};

export default BusinessEmployerProfile;