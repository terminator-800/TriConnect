import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../utils/role';
import jobpostApi from '../api/jobpostApi';

// export const useJobPosts = () =>
//   useQuery({
//     queryKey: ['jobpost'],
//     queryFn: jobpostApi.fetchAllJobPost,
//   });

export const usePendingJobPosts = () =>
  useQuery({
    queryKey: ['pendingJobPosts'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/pendingJobPosts`,
        { withCredentials: true } 
      );
      return response.data;
    },
  });

export const useUnappliedJobPosts = (user_id) =>
  useQuery({
    queryKey: ['unappliedJobPosts', user_id],
    queryFn: async () => {
      if (!user_id) return [];
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/unappliedJobPosts?user_id=${user_id}`
      );
      return response.data;
    },
    enabled: !!user_id,
  });

export const useJobPostsByUser = (user_id, category) =>
  useQuery({
    queryKey: ['jobPostsByUser', user_id, category],
    queryFn: async () => {
      if (!user_id) return [];
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobPosts?user_id=${user_id}${category ? `&category=${category}` : ''}`
      );
      return response.data;
    },
    enabled: !!user_id,
  });

export const useVerifiedJobPosts = () =>
  useQuery({
    queryKey: ['verifiedJobPosts'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/verifiedJobPosts`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });



