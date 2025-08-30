import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../utils/role';

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, role = ROLE.BUSINESS_EMPLOYER }) => {
      const prefix = role === ROLE.INDIVIDUAL_EMPLOYER
        ? '/individual-employer'
        : role === ROLE.MANPOWER_PROVIDER
          ? '/manpower-provider'
          : '/business-employer';

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}${prefix}/applications/${applicationId}/reject`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      // Refresh any applicants queries
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      alert('Applicant rejected successfully.');
    },
    onError: (error) => {
      console.error('Error rejecting applicant:', error?.response?.data || error.message);
      alert('Something went wrong while rejecting the applicant.');
    },
  });
};


