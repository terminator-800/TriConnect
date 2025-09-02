import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useDismissReport = () => {
    const queryClient = useQueryClient();

    const dismissReport = async ({ reportId }) => {
        if (!reportId) throw new Error('Report ID is required');

        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/administrator/dismiss-report`,
            { report_id: reportId },
            {
                withCredentials: true, 
            }
        );

        return response.data;
    };

    const mutation = useMutation({
        mutationFn: dismissReport,
        onSuccess: () => {
            queryClient.invalidateQueries(['reported-users']);
            queryClient.invalidateQueries(['users']);

        },
        onError: () => {
            alert('Failed to dismiss report. Please try again.');
        },
    });

    return mutation; 
};
