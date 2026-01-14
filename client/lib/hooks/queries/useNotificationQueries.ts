import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/lib/services/notificationService';
import { queryKeys } from '@/lib/api/queryClient';

export const useNotifications = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: [queryKeys.notifications.all, page, limit],
        queryFn: () => getNotifications(page, limit),
        // keepPreviousData: true, // Useful for pagination, need to check TanStack Query v5 syntax (placeholderData: keepPreviousData)
    });
};
