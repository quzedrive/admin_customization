import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { appearanceSettingsServices } from '@/lib/services/appearanceSettingsServices';

export const useAppearanceSettingsQueries = () => {

    const useAppearanceSettings = () => useQuery({
        queryKey: [queryKeys.appearanceSettings],
        queryFn: appearanceSettingsServices.getAppearanceSettings,
    });

    return {
        useAppearanceSettings,
    };
};
