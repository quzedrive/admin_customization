import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { brandServices, BrandParams } from '@/lib/services/brandServices';
import { queryKeys } from '@/lib/api/queryClient';

export const useBrandQueries = () => {
    const useAdminBrands = (params: BrandParams) => {
        return useQuery({
            queryKey: [queryKeys.brand.adminList, params],
            queryFn: () => brandServices.getAdminBrands(params),
            placeholderData: keepPreviousData, // Useful for pagination
        });
    };

    const usePublicBrands = (params: BrandParams) => {
        return useQuery({
            queryKey: [queryKeys.brand.publicList, params],
            queryFn: () => brandServices.getPublicBrands(params),
            placeholderData: keepPreviousData,
        });
    };

    return {
        useAdminBrands,
        usePublicBrands
    };
};
