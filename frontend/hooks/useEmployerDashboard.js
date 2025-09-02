import { useQuery } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

const ALLOWED_ROLES = [
  ROLE.BUSINESS_EMPLOYER,
  ROLE.INDIVIDUAL_EMPLOYER,
  ROLE.MANPOWER_PROVIDER,
];

export const useEmployerDashboard = (role) =>
  useQuery({
    queryKey: ['employer-dashboard', role],
    enabled: ALLOWED_ROLES.includes(role),
    queryFn: async () => {
      if (!ALLOWED_ROLES.includes(role)) {
        throw new Error('Unsupported role for employer dashboard');
      }
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/dashboard`,
        { withCredentials: true }
      );
      return data;
    },
    staleTime: 60_000,
  });


