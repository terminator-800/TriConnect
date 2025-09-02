import { useQuery } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const useApplicants = ({ page = 1, pageSize = 10, role } = {}) =>
  useQuery({
    queryKey: ['applicants', page, pageSize, role],
    queryFn: async () => {
      const endpoint = role === ROLE.INDIVIDUAL_EMPLOYER
        ? '/individual-employer/applicants'
        : role === ROLE.MANPOWER_PROVIDER
          ? '/manpower-provider/applicants'
          : '/business-employer/applicants';

      const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`,
        { params: { page, pageSize }, withCredentials: true });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 30,
    retry: 1,
  });


