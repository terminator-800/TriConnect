import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../utils/role';

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
        onError: (error) => {
            console.error('Approval failed:', error?.response?.data || error.message);
            alert('Failed to approve the job post.');
        },
    });
};
