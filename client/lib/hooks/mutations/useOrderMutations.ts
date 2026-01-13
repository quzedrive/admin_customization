import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderServices } from '@/lib/services/orderServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useOrderMutations = () => {
    const queryClient = useQueryClient();

    const useCreateOrder = () => {
        return useMutation({
            mutationFn: orderServices.createOrder,
            onSuccess: () => {
                toast.success('Order placed successfully!');
                // Invalidate admin list so admins see it immediately
                queryClient.invalidateQueries({ queryKey: [queryKeys.orders.adminList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to place order';
                toast.error(message);
            }
        });
    };

    const useUpdateOrder = () => {
        return useMutation({
            mutationFn: orderServices.updateOrder,
            onSuccess: () => {
                toast.success('Order updated successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.orders.adminList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to update order';
                toast.error(message);
            }
        });
    };

    const useCancelOrder = () => {
        return useMutation({
            mutationFn: orderServices.cancelOrder,
            onSuccess: () => {
                toast.success('Order cancelled successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.orders.adminList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to cancel order';
                toast.error(message);
            }
        });
    };

    return {
        useCreateOrder,
        useUpdateOrder,
        useCancelOrder
    };
};
