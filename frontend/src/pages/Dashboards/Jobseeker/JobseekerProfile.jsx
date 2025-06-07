import { useState, useEffect } from 'react';
import axios from 'axios';

const JobseekerProfile = () => {
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Make a GET request to fetch profile data
        const response = await axios.get('http://localhost:3001/jobseeker/profile', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setProfileData(response.data);
          setLoading(false);
          console.log("test 1");
          console.log("test 2");
        } else if (response.status === 400) {
          setError('Bad request. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div>
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Jobseeker Profile</h1>
        <div className="bg-white shadow-md rounded p-6 w-96">
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Is Verified:</strong> {profileData.isVerified ? 'Yes' : 'No'}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
        </div>
      </div>
    </div>
  );
};

export default JobseekerProfile;