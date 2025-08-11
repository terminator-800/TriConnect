import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../utils/role';

export function useVerifyUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/verify/user/${userId}`,
                {},
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            alert('User verified successfully!');
            queryClient.invalidateQueries({ queryKey: ['submittedUsers'] });
        },
        onError: (error) => {
            console.error('Verification failed:', error);
            alert('Something went wrong while verifying the user.');
        },
    });
}
