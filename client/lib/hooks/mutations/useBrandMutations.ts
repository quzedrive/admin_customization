import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandServices } from '@/lib/services/brandServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useBrandMutations = () => {
    const queryClient = useQueryClient();

    const useCreateBrand = () => {
        return useMutation({
            mutationFn: brandServices.createBrand,
            onSuccess: () => {
                toast.success('Brand created successfully');
                // Invalidate admin list to show new brand
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.adminList] });
                // Also invalidate public list if the new brand is active immediately
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.error || 'Failed to create brand';
                toast.error(message);
            }
        });
    };

    const useUpdateBrand = () => {
        return useMutation({
            mutationFn: brandServices.updateBrand,
            onSuccess: () => {
                toast.success('Brand updated successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.adminList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.error || 'Failed to update brand';
                toast.error(message);
            }
        });
    };

    const useDeleteBrand = () => {
        return useMutation({
            mutationFn: brandServices.deleteBrand,
            onSuccess: () => {
                toast.success('Brand deleted successfully');
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.adminList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.brand.publicList] });
            },
            onError: (error: any) => {
                const message = error.response?.data?.error || 'Failed to delete brand';
                toast.error(message);
            }
        });
    };

    return {
        useCreateBrand,
        useUpdateBrand,
        useDeleteBrand
    };
};
