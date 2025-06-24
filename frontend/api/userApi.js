import axios from "axios";

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/fetch');
    return response.data;
  } catch (err) {
    console.error("Failed to fetch users:", err.message);
    throw err; // allow react-query to handle error
  }
};

const fetchBusinessEmployereProfile = async () => {
  try {
    const response = await axios.get('http://localhost:3001/business-employer/profile', {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data; 
    } else if (response.status === 400) {
      console.log('Bad request. Please try again.');
    }
  } catch (err) {
    console.log('Failed to fetch profile data', err);
  }
};

const fetchIndividualEmployerProfile = async () => {
  try {
    const response = await axios.get('http://localhost:3001/individual-employer/profile', {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data; 
    } else if (response.status === 400) {
      console.log('Bad request. Please try again.');
    }
  } catch (err) {
    console.log('Failed to fetch profile data', err);
  }
};

const fetchJobseekerProfile = async () => {
  try {
    const response = await axios.get('http://localhost:3001/jobseeker/profile', {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data; 
    } else if (response.status === 400) {
      console.log('Bad request. Please try again.');
    }
  } catch (err) {
    console.log('Failed to fetch profile data', err);
  }
};

const fetchManpowerProviderProfile = async () => {
  try {
    
    const response = await axios.get('http://localhost:3001/manpower-provider/profile', {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data; 
    } else if (response.status === 400) {
      console.log('Bad request. Please try again.');
    }
  } catch (err) {
    console.log('Failed to fetch profile data', err);
  }
};


export default { fetchUsers, fetchBusinessEmployereProfile, fetchIndividualEmployerProfile, fetchJobseekerProfile, fetchManpowerProviderProfile }