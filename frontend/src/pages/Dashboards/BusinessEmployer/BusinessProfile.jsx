import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BusinessEmployerForm from './BusinessEmployerForm';
import Navbar from '../../Navbar';

const JobseekerProfile = () => {
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
      <Navbar userType={"business_employer"} />
      <div className="min-h-screen bg-gradient-to-b from-white to-cyan-400 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Business Employer Profile</h1>
        <div className="bg-white shadow-md rounded p-6 w-96">
          <p><strong>Name:</strong> {profileData.business_name}</p>
          <p><strong>Business Address:</strong> {profileData.business_address}</p>
          <p><strong>Verified:</strong> {profileData.is_verified ? 'Yes' : 'No'}</p>
          <p><strong>Industry:</strong> {profileData.industry}</p>
          <p><strong>Business Size:</strong> {profileData.business_size}</p>
          <p><strong>Auhtorized Person:</strong> {profileData.authorized_person}</p>
          <p><strong>Authorized Person ID:</strong></p><img src={`http://localhost:3001/uploads/business_employer/${profileData.authorized_person_id}`} />
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Registered at:</strong> {profileData.created_at}</p>
          <p><strong>Role:</strong> {profileData.role}</p>

          {/* ✅ Conditional rendering based on submission status */}
          {profileData.is_verified ? (
            <p className="text-green-600 font-semibold mt-4">Verified ✅</p>
          ) : profileData.is_submitted ? (
            <p className="text-yellow-600 font-semibold mt-4">Waiting for verification...</p>
          ) : (
            <button
              className="bg-blue-900 text-white px-5 py-1 rounded-xl mt-4 cursor-pointer"
              onClick={openFormm}
            >
              Submit your requirements
            </button>
          )}
        </div>



        {showForm && (
          <BusinessEmployerForm
            onClose={() => setShowForm(false)}
            onSubmitSuccess={() => {
              setShowForm(false);        // 👈 close the modal
              setRefreshTrigger(prev => prev + 1); // 👈 trigger re-fetch
            }}
          />
        )}

       
      </div>
    </>
  );
};

export default JobseekerProfile;