import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async ({ email, role }) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/resend-verification`, {
        email,
        role,
      });
      return response.data;
    }
  });
};
