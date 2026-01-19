import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotifications } from '@/lib/services/notificationService';
import { queryKeys } from '@/lib/api/queryClient';

export const useNotifications = (limit = 10) => {
    return useInfiniteQuery({
        queryKey: [queryKeys.notifications.all, limit],
        queryFn: ({ pageParam = 1 }) => getNotifications(pageParam as number, limit),
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.pages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};
