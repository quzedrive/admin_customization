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

    return {
        useAdminOrders
    };
};
