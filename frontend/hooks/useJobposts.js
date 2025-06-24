// 📁 hooks/useJobPosts.js
import { useQuery } from '@tanstack/react-query';
import jobPostApi from '../api/jobpostApi';

export const useJobPosts = () =>
  useQuery({
    queryKey: ['jobpost'],
    queryFn: jobPostApi.fetchAllJobPost,
  });
