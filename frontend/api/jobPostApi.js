import axios from "axios";

const fetchAllJobPost = async () => {
    try {
        // Naa ni sa admin na fetched
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/administrator/jobposts`);
        return response.data;
        
    } catch (err) {
    console.error("Failed to fetch job posts:", err.message);
    }
};

export default { fetchAllJobPost }