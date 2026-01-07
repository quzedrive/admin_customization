import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancellationReasonServices, CancellationReason } from '@/lib/services/cancellationReasonServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useCancellationReasonMutations = () => {
    const queryClient = useQueryClient();

    // Create
    const useCreateReason = () => {
        return useMutation({
            mutationFn: (data: Partial<CancellationReason>) => cancellationReasonServices.createReason(data),
            onSuccess: () => {
                toast.success('Cancellation reason created successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.cancellationReasons.list] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to create reason');
            }
        });
    };

    // Update
    const useUpdateReason = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: Partial<CancellationReason> }) =>
                cancellationReasonServices.updateReason(id, data),
            onSuccess: () => {
                toast.success('Cancellation reason updated successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.cancellationReasons.list] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.cancellationReasons.detail] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update reason');
            }
        });
    };

    // Delete
    const useDeleteReason = () => {
        return useMutation({
            mutationFn: (id: string) => cancellationReasonServices.deleteReason(id),
            onSuccess: () => {
                toast.success('Cancellation reason deleted successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.cancellationReasons.list] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to delete reason');
            }
        });
    };

    return {
        useCreateReason,
        useUpdateReason,
        useDeleteReason,
    };
};
