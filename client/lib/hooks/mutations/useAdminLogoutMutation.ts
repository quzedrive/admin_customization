import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminServices } from '@/lib/services/adminServices';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import client from '@/lib/api/client';
import toast from 'react-hot-toast';

export const useAdminLogoutMutation = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminServices.logout,
        onSuccess: () => {
            dispatch(logout());
            // Clear axios header
            delete client.defaults.headers.common['Authorization'];
            // Clear query cache
            queryClient.clear();

            toast.success('Logged out successfully');
            router.push('/admin/login');
        },
        onError: (error: any) => {
            console.error('Logout error:', error);
            // Even if API fails, we should clear local state
            dispatch(logout());
            delete client.defaults.headers.common['Authorization'];
            queryClient.clear();
            router.push('/admin/login');
        }
    });
};
