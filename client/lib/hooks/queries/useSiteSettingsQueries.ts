import { useQuery } from '@tanstack/react-query';
import { siteSettingsServices } from '@/lib/services/siteSettingsServices';
import { queryKeys } from '@/lib/api/queryClient';

export const useSiteSettingsQueries = () => {
    const useSiteSettings = () => {
        return useQuery({
            queryKey: [queryKeys.siteSettings],
            queryFn: siteSettingsServices.getSettings,
        });
    };

    return {
        useSiteSettings,
        useEmailConfig: () => useQuery({
            queryKey: [queryKeys.emailConfig],
            queryFn: siteSettingsServices.getEmailConfig,
        }),
        useImageUploadConfig: () => useQuery({
            queryKey: [queryKeys.imageUploadConfig],
            queryFn: siteSettingsServices.getImageUploadConfig,
        }),
    };
};
