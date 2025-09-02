import { useQuery } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios'

export const useUserProfile = (role) => {
  return useQuery({
    queryKey: ['user-profile', role],
    enabled: !!role,
    queryFn: async () => {
      if (!role) throw new Error('Role is required to fetch profile.');

      const allowedRoles = Object.values(ROLE);

      if (!allowedRoles.includes(role)) {
        throw new Error(`Unsupported role: ${role}`);
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/${role}/profile`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useSubmittedUsers = () =>
  useQuery({
    queryKey: ['submittedUsers'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/submittedUsers`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });

export const useVerifiedUsers = () =>
  useQuery({
    queryKey: ['verifiedUsers'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/verifiedUsers`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });

