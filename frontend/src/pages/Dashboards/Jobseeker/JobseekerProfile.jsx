import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JobseekerForm from './JobseekerForm';
import Navbar from '../../Navbar';

const JobseekerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // 👈 State to toggle form
  const hasFetched = useRef(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // if (hasFetched.current) return; // Already fetched
    // hasFetched.current = true;

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/jobseeker/profile', {
          withCredentials: true,
        });
        console.log("test 1");
        console.log("test 2");
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
    setShowForm(true); // 👈 Show the JobseekerForm component
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar userType={"business_employer"} />
      <div className="min-h-screen bg-gradient-to-b from-white to-cyan-400 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Jobseeker Profile</h1>
        <div className="bg-white shadow-md rounded p-6 w-96">
          <p><strong>Name:</strong> {profileData.full_name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Is Verified:</strong> {profileData.is_verified ? 'Yes' : 'No'}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Phone:</strong> {profileData.gender}</p>
          <p><strong>Permanent address:</strong> {profileData.permanent_address}</p>
          <p><strong>Present Address:</strong> {profileData.present_address}</p>
          <p><strong>Education:</strong> {profileData.education}</p>
          <p><strong>Skills:</strong> {profileData.skills}</p>
          <p><strong>Government ID:</strong> {profileData.government_id}</p>
          <p><strong>Selfie ID:</strong> {profileData.selfie_with_id}</p>
          <p><strong>NBI or Baranggay Clearance:</strong> {profileData.nbi_barangay_clearance}</p>

          <p><strong>Role:</strong> {profileData.role}</p>

          {/* ✅ Conditional rendering based on submission status */}
          {profileData.is_verified ? (
            <p className="text-green-600 font-semibold mt-4">Verified ✅</p>
          ) : profileData.is_rejected ? (
            <>
              <p className="text-red-600 font-semibold mt-4">
                Your submitted documents are invalid ❌
              </p>
              <button
                className="bg-blue-900 text-white px-5 py-1 rounded-xl mt-4 cursor-pointer"
                onClick={openFormm}
              >
                Submit your requirements
              </button>
            </>
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
          <JobseekerForm
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