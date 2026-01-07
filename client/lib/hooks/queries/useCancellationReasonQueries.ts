import { useQuery } from '@tanstack/react-query';
import { cancellationReasonServices } from '@/lib/services/cancellationReasonServices';
import { queryKeys } from '@/lib/api/queryClient';

export const useCancellationReasonQueries = () => {

    // List Query
    const useGetReasons = (params?: { type?: string }) => {
        return useQuery({
            queryKey: [queryKeys.cancellationReasons.list, params],
            queryFn: () => cancellationReasonServices.getAllReasons(params),
        });
    };

    // Detail Query
    const useGetReasonById = (id: string) => {
        return useQuery({
            queryKey: [queryKeys.cancellationReasons.detail, id],
            queryFn: () => cancellationReasonServices.getReasonById(id),
            enabled: !!id,
        });
    };

    return {
        useGetReasons,
        useGetReasonById,
    };
};
