import { useQuery } from '@tanstack/react-query';
import { dashboardServices } from '@/lib/services/dashboardService';
import { queryKeys } from '@/lib/api/queryClient';

export const useDashboardQueries = () => {
    const { data, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: [queryKeys.dashboard.stats],
        queryFn: dashboardServices.getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        stats: data,
        isLoading,
        error,
        refetch,
        isRefetching
    };
};

export const useDashboardAnalytics = (period = 'monthly') => {
    const { data, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: [queryKeys.dashboard.analytics, period],
        queryFn: () => dashboardServices.getAnalytics(period),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        analytics: data,
        isLoading,
        error,
        refetch,
        isRefetching
    };
};
