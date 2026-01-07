import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { packageServices, PackageParams } from '@/lib/services/packageServices';
import { queryKeys } from '@/lib/api/queryClient';

export const usePackageQueries = () => {
    const useAdminPackages = (params: PackageParams) => {
        return useQuery({
            queryKey: [queryKeys.package.adminList, params],
            queryFn: () => packageServices.getAdminPackages(params),
            placeholderData: keepPreviousData,
        });
    };

    const usePublicPackages = () => {
        return useQuery({
            queryKey: [queryKeys.package.publicList],
            queryFn: () => packageServices.getPublicPackages(),
        });
    };

    const usePackageById = (id: string | null) => {
        return useQuery({
            queryKey: ['package', id],
            queryFn: () => packageServices.getPackageById(id!),
            enabled: !!id,
        });
    };

    return {
        useAdminPackages,
        usePublicPackages,
        usePackageById
    };
};
