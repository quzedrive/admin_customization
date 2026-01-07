import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { carServices } from '@/lib/services/carServices';

export const useCarQueries = () => {
    const useGetAllCars = () => {
        return useQuery({
            queryKey: [queryKeys.cars.adminList],
            queryFn: carServices.getAllCars,
        });
    };

    const useGetPublicCars = () => {
        return useQuery({
            queryKey: [queryKeys.cars.publicList],
            queryFn: carServices.getPublicCars,
        });
    };

    const useGetCarById = (id: string) => {
        return useQuery({
            queryKey: [queryKeys.cars.detail, id],
            queryFn: () => carServices.getCarById(id),
            enabled: !!id,
        });
    };

    return {
        useGetAllCars,
        useGetPublicCars,
        useGetCarById
    };
};
