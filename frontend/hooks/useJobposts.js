import { useQuery } from '@tanstack/react-query';
import jobPostApi from '../api/jobPostApi';

export const useJobPosts = () =>
  useQuery({
    queryKey: ['jobpost'],
    queryFn: jobPostApi.fetchAllJobPost,
  });
