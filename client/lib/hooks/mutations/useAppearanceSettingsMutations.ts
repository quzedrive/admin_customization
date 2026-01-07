import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { appearanceSettingsServices } from '@/lib/services/appearanceSettingsServices';
import toast from 'react-hot-toast';

export const useAppearanceSettingsMutations = () => {
    const queryClient = useQueryClient();

    const useUpdateAppearanceSettings = () => useMutation({
        mutationFn: appearanceSettingsServices.updateAppearanceSettings,
        onSuccess: (data) => {
            toast.success('Appearance settings updated');
            queryClient.invalidateQueries({ queryKey: [queryKeys.appearanceSettings] });
            // Here you could also trigger a theme update in a global context or similar
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to update appearance settings';
            toast.error(message);
        }
    });

    return {
        useUpdateAppearanceSettings,
    };
};
