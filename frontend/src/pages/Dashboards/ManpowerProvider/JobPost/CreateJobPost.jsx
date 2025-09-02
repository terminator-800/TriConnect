import { useState } from "react";
import { useUserProfile } from "../../../../../hooks/useUserProfiles";
import { ROLE } from "../../../../../utils/role";
import VerificationStatus from "../VerificationForm/VerificationStatus";
import JobPostForm from "./JobPostForm";
import Sidebar from "../Sidebar";
import Form from '../VerificationForm/Form';

const CreateJobPost = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    refetch
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);

  if (loadingProfile) return <div>Loading profile...</div>;
  if (!profileData) return <div className="text-red-600">Failed to load profile.</div>;

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  return (
    <>
      <Sidebar />
      <div className="relative min-h-[140vh] bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
        {profileData.is_verified ? (
          <JobPostForm />
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
      </div>

      {showForm && (
        <Form
          onClose={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
          }}
          onSubmitSuccess={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}
    </>
  );
};

export default CreateJobPost;
