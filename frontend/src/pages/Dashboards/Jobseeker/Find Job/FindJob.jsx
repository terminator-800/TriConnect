import { useState } from "react";
import { useJobseekerProfile } from "../../../../../hooks/useUserProfiles";
import Sidebar from "../Sidebar"
import BrowseJob from "./BrowseJob"
import VerificationStatus from '../Verification Form/VerificationStatus'
import Form from "../Verification Form/Form";

const FindJob = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError,
    refetch,
  } = useJobseekerProfile();

  if (loadingProfile) return <div>Loading profile...</div>;
  if (isError) return <div>Failed to load profile.</div>;

  const openForm = () => {
    document.body.style.overflow = "hidden";
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
              refetch();
            }}
          />
        )}
      </div>
    </>
  )
}

export default FindJob