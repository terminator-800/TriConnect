import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLE } from "../utils/role";
import axios from "axios";

export const useReportUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData, role }) => {
            const BASE_URL = import.meta.env.VITE_API_URL;

            let path;

            switch (role) {
                case ROLE.JOBSEEKER:
                    path = `/${ROLE.JOBSEEKER}/report-user`;
                    break;
                case ROLE.BUSINESS_EMPLOYER:
                    path = `/${ROLE.BUSINESS_EMPLOYER}/report-user`;
                    break;
                case ROLE.INDIVIDUAL_EMPLOYER:
                    path = `/${ROLE.INDIVIDUAL_EMPLOYER}/report-user`;
                    break;
                case ROLE.MANPOWER_PROVIDER:
                    path = `/${ROLE.MANPOWER_PROVIDER}/report-user`;
                    break;
            }

            const endpoint = `${BASE_URL}${path}`;
            const res = await axios.post(endpoint, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        },

        onSuccess: (data, variables) => {
            const role = variables.role;

            queryClient.invalidateQueries(['reported-users', role]);

        },

        onError: (error) => {
            if (error.response?.status === 409) {
                alert("⚠️ You have already reported this user.");
            } else {
                alert("❌ Failed to submit report.");
            }
        }
        
    });
};

export const useReportedUsers = (role) => {
    return useQuery({
        queryKey: ['reported-users', role],
        queryFn: async () => {
            const BASE_URL = import.meta.env.VITE_API_URL;

            let path = "/reported-users";
            switch (role) {
                case ROLE.JOBSEEKER:
                    path = `/${ROLE.JOBSEEKER}/reported-users`;
                    break;
                case ROLE.BUSINESS_EMPLOYER:
                    path = `/${ROLE.BUSINESS_EMPLOYER}/reported-users`;
                    break;
                case ROLE.INDIVIDUAL_EMPLOYER:
                    path = `/${ROLE.INDIVIDUAL_EMPLOYER}/reported-users`;
                    break;
                case ROLE.MANPOWER_PROVIDER:
                    path = `/${ROLE.MANPOWER_PROVIDER}/reported-users`;
                    break;
            }

            const endpoint = `${BASE_URL}${path}`;

            const res = await axios.get(endpoint, {
                withCredentials: true,
            });

            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

// used in administrator
export const useAllReportedUsers = () => {
    return useQuery({
        queryKey: ['all-reported-users'],
        queryFn: async () => {
            const BASE_URL = import.meta.env.VITE_API_URL;
            const endpoint = `${BASE_URL}/${ROLE.ADMINISTRATOR}/all-reported-users`;

            const res = await axios.get(endpoint, {
                withCredentials: true,
            });
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
