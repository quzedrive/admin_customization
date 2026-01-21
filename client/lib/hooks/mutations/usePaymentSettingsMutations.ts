import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentSettingsServices } from '@/lib/services/paymentSettingsServices';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const usePaymentSettingsMutations = () => {
    const queryClient = useQueryClient();

    const onSuccess = (message: string) => {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [queryKeys.paymentSettings] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.paymentSettings, 'active'] });
    };

    const onError = (error: any) => {
        const message = error.response?.data?.message || 'Failed to update settings';
        toast.error(message);
    };

    const useUpdatePaymentSettings = () => useMutation({
        mutationFn: paymentSettingsServices.updateSettings,
        onSuccess: () => onSuccess('Payment settings updated'),
        onError
    });

    const useToggleActiveMethod = () => useMutation({
        mutationFn: paymentSettingsServices.updateActiveMethod,
        onSuccess: () => onSuccess('Active payment method updated'),
        onError
    });

    return {
        useUpdatePaymentSettings,
        useToggleActiveMethod
    };
};
