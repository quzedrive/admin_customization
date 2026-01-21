import { useQuery } from '@tanstack/react-query';
import { paymentSettingsServices } from '@/lib/services/paymentSettingsServices';
import { queryKeys } from '@/lib/api/queryClient';

export const usePaymentSettingsQueries = () => {
    const usePaymentSettings = () => {
        return useQuery({
            queryKey: [queryKeys.paymentSettings],
            queryFn: paymentSettingsServices.getSettings,
        });
    };

    const useActivePaymentMethod = () => {
        return useQuery({
            queryKey: [queryKeys.paymentSettings, 'active'],
            queryFn: paymentSettingsServices.getActiveMethod,
        });
    };

    return {
        usePaymentSettings,
        useActivePaymentMethod,
    };
};
