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

export const useUnappliedJobPosts = () =>
  useQuery({
    queryKey: ['unappliedJobPosts'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/unappliedJobPosts`,
          {
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching unapplied job posts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });


export const useJobPostsByUser = (category) =>
  useQuery({
    queryKey: ['jobPostsByUser', category],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobPosts${category ? `?category=${category}` : ''}`,
        { withCredentials: true } 
      );
      return response.data;
    },
    enabled: true, 
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



