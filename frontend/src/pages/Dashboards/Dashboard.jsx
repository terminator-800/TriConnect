import { useEffect, useState } from 'react'
import axios from 'axios'
import NotFoundPage from '../NotFoundPage'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashRes = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
        console.log('Dashboard response:', dashRes.data);
        if (dashRes.status === 200) {
            navigate('/dashboard/jobseeker'); 
        }else if(dashRes.status === 401) {
            setUnauthorized(true) 
        }
        setUnauthorized(false);
      } catch (dashErr) {
        console.error('Dashboard error:', dashErr.response?.data || dashErr.message);
        if (dashErr.response && dashErr.response.status === 401) {
          setUnauthorized(true);
        }
      }
    };
    fetchDashboard();
  }, []);

  if (unauthorized) {
    return <NotFoundPage />;
  }

  return (
    <div>
        yawa
    </div>
  )
}

export default Dashboard