import { useState, useEffect } from "react";
import Sidebar from "./Sidebar"
import BrowseJob from "./BrowseJob"
import userApi from '../../../../api/userApi';
import VerificationStatus from './VerificationStatus'
import Form from "./Form";

const FindJob = () => {
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoadingProfile(true);
        const data = await userApi.fetchJobseekerProfile();
        console.log(data);
        
        if (data) {
          setProfileData(data);
        }
        
      } catch (err) {
        console.log("Failed to fetch profile data.", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    getProfile();
  }, [refreshTrigger]);

  if (loadingProfile) return <div>Loading profile...</div>;

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  
  return (
    <>
      {/*  */}
      <Sidebar />
      <div className="relative min-h-screen  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50 pb-15">
        {profileData.is_verified ? (
          <BrowseJob/>
        ) : profileData.is_rejected ? (
          <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />

          </div>

        ) : profileData.is_submitted ? (
          <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />

          </div>
        ) : (
          <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />

          </div>
        )}

        {showForm && (
          <Form
            onClose={() => {
              setShowForm(false)
              document.body.style.overflow = 'auto';
            }}
            onSubmitSuccess={() => {
              setShowForm(false);
              setRefreshTrigger(prev => prev + 1);
            }}
          />
        )}
      </div>
    </>
  )
}

export default FindJob