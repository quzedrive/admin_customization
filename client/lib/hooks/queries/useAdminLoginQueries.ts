import { useQuery } from '@tanstack/react-query';
import { adminServices } from '@/lib/services/adminServices';
import { queryKeys } from '@/lib/api/queryClient';

export const useAdminLoginQueries = () => {
    // This hook fetches the current admin's profile
    // Assuming 'me' needs authentication, client interceptor handles attaching token
    return useQuery({
        queryKey: [queryKeys.admin.me],
        queryFn: adminServices.getMe,
        retry: false, // Don't retry if auth fails
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
