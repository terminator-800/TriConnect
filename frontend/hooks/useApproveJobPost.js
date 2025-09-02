import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const useApproveJobPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        
        mutationFn: async (jobPostId) => {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/approve/jobpost/${jobPostId}`,
                {},
                { withCredentials: true }
            );
            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(['pendingJobPosts']);
        },

        onError: () => {
            alert('Failed to approve the job post.');
        },

    });
};
