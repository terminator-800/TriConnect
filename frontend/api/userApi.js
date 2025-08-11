// import axios from "axios";

// const fetchApplicants = async ({ page = 1, pageSize = 10 } = {}) => {
//   const url = `${import.meta.env.VITE_API_URL}/business-employer/applicants`;
//   const params = { page, pageSize };
//   const response = await axios.get(url, { params, withCredentials: true });
//   return response.data;
// };

// const fetchUsers = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/fetch`);
//     return response.data;
//   } catch (err) {
//     console.error("Failed to fetch users:", err.message);
//     throw err; 
//   }
// };

// const fetchAdministratorProfile = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/administrator/profile`, {
//       withCredentials: true,
//     });

//     if (response.status === 200) {
//       return response.data; 
//     } else if (response.status === 400) {
//       console.log('Bad request. Please try again.');
//     }
//   } catch (err) {
//     console.log('Failed to fetch profile data', err);
//   }
// };

// const fetchBusinessEmployereProfile = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/business-employer/profile`, {
//       withCredentials: true,
//     });

//     if (response.status === 200) {
//       return response.data; 
//     } else if (response.status === 400) {
//       console.log('Bad request. Please try again.');
//     }
//   } catch (err) {
//     console.log('Failed to fetch profile data', err);
//   }
// };

// const fetchIndividualEmployerProfile = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/individual-employer/profile`, {
//       withCredentials: true,
//     });

//     if (response.status === 200) {
//       return response.data; 
//     } else if (response.status === 400) {
//       console.log('Bad request. Please try again.');
//     }
//   } catch (err) {
//     console.log('Failed to fetch profile data', err);
//   }
// };

// const fetchJobseekerProfile = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobseeker/profile`, {
//       withCredentials: true,
//     });

//     if (response.status === 200) {
//       return response.data; 
//     } else if (response.status === 400) {
//       console.log('Bad request. Please try again.');
//     }
//   } catch (err) {
//     console.log('Failed to fetch profile data', err);
//   }
// };

// const fetchManpowerProviderProfile = async () => {
//   try {
    
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/manpower-provider/profile`, {
//       withCredentials: true,
//     });

//     if (response.status === 200) {
//       return response.data; 
//     } else if (response.status === 403) {
//       console.log('Bad request. Please try again.');
//     }
//   } catch (err) {
//     console.log('Failed to fetch profile data', err);
//   }
// };


// export default { 
//   fetchUsers, 
//   fetchBusinessEmployereProfile, 
//   fetchIndividualEmployerProfile, 
//   fetchJobseekerProfile, 
//   fetchManpowerProviderProfile,
//   fetchAdministratorProfile,
//   fetchApplicants
// }