import { useState, useEffect } from 'react';
import { useJobseekerProfile } from "../../../../../hooks/useUserProfiles";
import Sidebar from '../Sidebar';
import icons from '../../../../assets/svg/Icons';
import Form from '../Verification Form/Form';
import PersonalInfo from './PersonalInfo';
import Security from './Security';
import VerificationStatus from '../Verification Form/VerificationStatus';

const JobseekerProfile = () => {
  const personal = 'personal'
  const security = 'security'
  const [activeTab, setActiveTab] = useState(personal);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    gender: '',
  });

   const {
    data: profileData,
    isLoading: loading,
    isError,
    refetch,
  } = useJobseekerProfile();

  useEffect(() => {
    if (profileData) {
      setFormData({
        email: profileData.email || '',
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        gender: profileData.gender || '',
      });
    }
  }, [profileData]);

  const openForm = () => setShowForm(true);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (isError) return <div>Failed to fetch profile data.</div>;

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-40">
        <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
          {profileData.is_verified ? (
            <>
              <div className="flex items-center pt-20 justify-between w-full">
                <div>
                  <h1 className='font-bold text-4xl'>{profileData.full_name}</h1>
                  <div className="bg-white p-3 rounded-md shadow-md flex justify-between items-center w-full border border-gray-300 mt-5">
                    <div className="flex gap-4 items-center">
                      <div>
                        <div className='flex'>
                          <h1 className="font-bold text-2xl text-yellow-900">Account Verified</h1>
                          <img src={icons.verified} alt="" />
                        </div>
                        <p className="text-yellow-900 max-w-4xl">
                          Your account has been successfully verified and all submitted requirements have been approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="bg-gray-300 w-30 h-30 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                    PHOTO
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white w-full flex justify-between mt-20 gap-5">
                <button
                  onClick={() => setActiveTab(personal)}
                  className={`px-10 py-1 rounded-md w-full cursor-pointer transition-all duration-200
                    ${activeTab === personal ? 'bg-blue-900 text-white' : 'bg-white border border-blue-900 text-blue-900'}`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab(security)}
                  className={`px-10 py-1 rounded-md w-full cursor-pointer transition-all duration-200
                    ${activeTab === security ? 'bg-blue-900 text-white' : 'bg-white border border-blue-900 text-blue-900'}`}
                >
                  Security
                </button>
              </div>

              {activeTab === personal && (
                <PersonalInfo
                  formData={formData}
                  profileData={profileData}
                  editMode={editMode}
                  handleInputChange={handleInputChange}
                  setEditMode={setEditMode}
                  setFormData={setFormData}
                />
              )}

              {activeTab === security && <Security />}
            </>
          ) : profileData.is_rejected ? (
            <VerificationStatus profileData={profileData} openForm={openForm} />
          ) : profileData.is_submitted ? (
            <VerificationStatus profileData={profileData} openForm={openForm} />
          ) : (
            <VerificationStatus profileData={profileData} openForm={openForm} />
          )}
        </div>

        {showForm && (
          <Form
            onClose={() => setShowForm(false)}
            onSubmitSuccess={() => {
              setShowForm(false);
              refetch();
            }}
          />
        )}
      </div>
    </>
  );
};

export default JobseekerProfile;
