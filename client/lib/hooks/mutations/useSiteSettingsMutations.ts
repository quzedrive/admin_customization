import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsServices } from '@/lib/services/siteSettingsServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useSiteSettingsMutations = () => {
    const queryClient = useQueryClient();

    const onSuccess = (message: string) => {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [queryKeys.siteSettings] });
    };

    const onError = (error: any) => {
        const message = error.response?.data?.message || 'Failed to update settings';
        toast.error(message);
    };

    const useUpdateGeneral = () => useMutation({
        mutationFn: siteSettingsServices.updateGeneral,
        onSuccess: () => onSuccess('General settings updated'),
        onError
    });

    const useUpdateContact = () => useMutation({
        mutationFn: siteSettingsServices.updateContact,
        onSuccess: () => onSuccess('Contact settings updated'),
        onError
    });

    const useUpdateSocial = () => useMutation({
        mutationFn: siteSettingsServices.updateSocial,
        onSuccess: () => onSuccess('Social links updated'),
        onError
    });

    const useUpdateSeo = () => useMutation({
        mutationFn: siteSettingsServices.updateSeo,
        onSuccess: () => onSuccess('SEO settings updated'),
        onError
    });

    const useUpdateMaintenance = () => useMutation({
        mutationFn: siteSettingsServices.updateMaintenance,
        onSuccess: () => onSuccess('Maintenance mode updated'),
        onError
    });

    const useUpdateBaseTiming = () => useMutation({
        mutationFn: siteSettingsServices.updateBaseTiming,
        onSuccess: () => onSuccess('Base timing updated'),
        onError
    });

    const useUpdateEmailConfig = () => useMutation({
        mutationFn: siteSettingsServices.updateEmailConfig,
        onSuccess: () => {
            toast.success('Email settings updated');
            queryClient.invalidateQueries({ queryKey: [queryKeys.emailConfig] });
        },
        onError
    });

    const useUpdateImageUploadConfig = () => useMutation({
        mutationFn: siteSettingsServices.updateImageUploadConfig,
        onSuccess: () => {
            toast.success('Image upload settings updated');
            queryClient.invalidateQueries({ queryKey: [queryKeys.imageUploadConfig] });
        },
        onError
    });

    return {
        useUpdateGeneral,
        useUpdateContact,
        useUpdateSocial,
        useUpdateSeo,
        useUpdateMaintenance,
        useUpdateBaseTiming,
        useUpdateEmailConfig,
        useUpdateImageUploadConfig
    };
};
