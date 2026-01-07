import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { carServices } from '@/lib/services/carServices';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useCarMutations = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const createCarMutation = useMutation({
        mutationFn: carServices.createCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.adminList] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.publicList] });
            toast.success('Car created successfully');
            router.push('/admin/cars-management/list-page');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create car');
        },
    });

    const updateCarMutation = useMutation({
        mutationFn: carServices.updateCar,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.adminList] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.publicList] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.detail, variables.id] });
            toast.success('Car updated successfully');
            router.push('/admin/cars-management/list-page');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update car');
        },
    });

    const deleteCarMutation = useMutation({
        mutationFn: carServices.deleteCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.adminList] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.publicList] });
            toast.success('Car deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete car');
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: carServices.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.adminList] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.cars.publicList] });
            toast.success('Car status updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    return {
        createCarMutation,
        updateCarMutation,
        deleteCarMutation,
        toggleStatusMutation,
    };
};
