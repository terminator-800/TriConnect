import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../../../../../utils/role';

// Custom hook to fetch bar chart data
export const useFetchChartData = () => {
  return useQuery({
    queryKey: ['chartData'], // Unique key for caching
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/chart-data`,
        { withCredentials: true }
      );
      return response.data; // Return data from backend
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache duration
    retry: 2, // Retry twice on failure
  });
};
