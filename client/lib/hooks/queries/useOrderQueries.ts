import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { orderServices, OrderParams } from '@/lib/services/orderServices';
import { queryKeys } from '@/lib/api/queryClient';

export const useOrderQueries = () => {
    const useAdminOrders = (params: OrderParams) => {
        return useQuery({
            queryKey: [queryKeys.orders.adminList, params],
            queryFn: () => orderServices.getAdminOrders(params),
            placeholderData: keepPreviousData,
        });
    };

    const useTrackOrder = (id: string, options?: any) => {
        return useQuery<any>({
            queryKey: [queryKeys.orders.tracking, id],
            queryFn: () => orderServices.getTrackedOrder(id),
            enabled: !!id,
            retry: false,
            ...options
        });
    };

    const usePriceHistory = (id: string) => {
        return useQuery({
            queryKey: ['priceHistory', id],
            queryFn: () => orderServices.getPriceHistory(id),
            enabled: !!id
        });
    };

    return {
        useAdminOrders,
        useTrackOrder,
        usePriceHistory
    };
};
