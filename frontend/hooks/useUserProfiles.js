import { useQuery } from '@tanstack/react-query';
import userApi from '../api/userApi';

export const useJobseekerProfile = () =>
  useQuery({
    queryKey: ['jobseeker'],
    queryFn: userApi.fetchJobseekerProfile,
  });

export const useBusinessEmployerProfile = () =>
  useQuery({
    queryKey: ['business'],
    queryFn: userApi.fetchBusinessEmployereProfile,
  });

export const useIndividualEmployerProfile = () =>
  useQuery({
    queryKey: ['individual'],
    queryFn: userApi.fetchIndividualEmployerProfile,
  });

export const useManpowerProviderProfile = () =>
  useQuery({
    queryKey: ['manpowerProvider'],
    queryFn: userApi.fetchManpowerProviderProfile,
  });

export const useAllUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: userApi.fetchUsers,
  });

export const useSubmittedUsers = () =>
  useQuery({
    queryKey: ['submittedUsers'],
    queryFn: async () => {
      const users = await userApi.fetchUsers();
      return users.filter(
        (user) => user.is_submitted === 1 && user.is_verified !== 1
      );
    },
  });