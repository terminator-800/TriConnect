import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../utils/role';

export const useRejectJobPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobPostId) => {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/reject/jobpost/${jobPostId}`,
                {},
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingJobPosts']);
        },
        onError: (error) => {
            console.error('Error rejecting job post:', error?.response?.data || error.message);
            alert('Something went wrong while rejecting the job post.');
        },
    });
};
