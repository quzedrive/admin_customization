import { adminServices } from '@/lib/services/adminServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';

export const useAdminLoginMutations = () => {
    const queryClient = useQueryClient();


    const loginMutation = useMutation({
        mutationFn: adminServices.login,
        onSuccess: () => {
            // Reset the admin profile query to ensure we fetch fresh data and clear any cached errors
            queryClient.resetQueries({ queryKey: [queryKeys.admin.me] });
        }
    });

    const useForgotPassword = () => useMutation({
        mutationFn: adminServices.forgotPassword,
        onSuccess: () => {
            // Optional: toast success handled in component
        }
    });

    const useResetPassword = () => useMutation({
        mutationFn: adminServices.resetPassword,
        onSuccess: (data) => {
            // After reset, we might get a token back to auto-login, or user has to login
            // Based on backend implementation, we return token.
            // If backend auto-logs in:
            /*
            if(data.qq_access_token) {
                 // handle login - but hooks are better kept pure or component handles it
            }
            */
        }
    });

    return {
        loginMutation,
        useForgotPassword,
        useResetPassword
    };
};
