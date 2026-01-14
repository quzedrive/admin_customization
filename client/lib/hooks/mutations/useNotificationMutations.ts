import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsRead, markAllAsRead, deleteNotification } from '@/lib/services/notificationService';
import { queryKeys } from '@/lib/api/queryClient';

export const useNotificationMutations = () => {
    const queryClient = useQueryClient();

    const markAsReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.notifications.all] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.notifications.all] });
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.notifications.all] });
        },
    });

    return {
        markAsReadMutation,
        markAllAsReadMutation,
        deleteNotificationMutation,
    };
};
