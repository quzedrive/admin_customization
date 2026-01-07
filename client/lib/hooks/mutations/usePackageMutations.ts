import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packageServices } from '@/lib/services/packageServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const usePackageMutations = () => {
    const queryClient = useQueryClient();

    const useCreatePackage = () => {
        return useMutation({
            mutationFn: packageServices.createPackage,
            onSuccess: () => {
                toast.success('Package created successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.adminList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to create package';
                toast.error(message);
            }
        });
    };

    const useUpdatePackage = () => {
        return useMutation({
            mutationFn: packageServices.updatePackage,
            onSuccess: () => {
                toast.success('Package updated successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.adminList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to update package';
                toast.error(message);
            }
        });
    };

    const useDeletePackage = () => {
        return useMutation({
            mutationFn: packageServices.deletePackage,
            onSuccess: () => {
                toast.success('Package deleted successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.adminList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.package.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || 'Failed to delete package';
                toast.error(message);
            }
        });
    };

    return {
        useCreatePackage,
        useUpdatePackage,
        useDeletePackage
    };
};
