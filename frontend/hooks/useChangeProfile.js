import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useChangeProfile = (role) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file) => {
            if (!file) throw new Error("No file provided");

            const formData = new FormData();
            formData.append("profile", file); 

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/${role}/change-profile`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["userProfile"]);
            alert("Change profile successfully!")
        },

        onError: () => {
            alert("Failed to change profile.");
        },
    });
};
