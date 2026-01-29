import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { carServices } from '@/lib/services/carServices';

export const useCarQueries = () => {
    const useGetAllCars = () => {
        return useQuery({
            queryKey: [queryKeys.cars.adminList],
            queryFn: carServices.getAllCars,
        });
    };

    const useGetPublicCars = (filters?: any) => {
        return useQuery({
            queryKey: [queryKeys.cars.publicList, filters],
            queryFn: () => carServices.getPublicCars(1, 10, filters),
        });
    };

    const useGetPublicCarsInfinite = (limit = 10, filters?: any) => {
        return useInfiniteQuery({
            queryKey: [queryKeys.cars.publicList, 'infinite', limit, filters],
            queryFn: ({ pageParam = 1 }) => carServices.getPublicCars(pageParam as number, limit, filters),
            getNextPageParam: (lastPage: any) => {
                if (lastPage.pagination.page < lastPage.pagination.pages) {
                    return lastPage.pagination.page + 1;
                }
                return undefined;
            },
            initialPageParam: 1,
            placeholderData: keepPreviousData, // Keep previous data while fetching new data
        });
    };

    const useGetCarById = (id: string) => {
        return useQuery({
            queryKey: [queryKeys.cars.detail, id],
            queryFn: () => carServices.getCarById(id),
            enabled: !!id,
        });
    };

    const useGetCarBySlug = (slug: string) => {
        return useQuery({
            queryKey: [queryKeys.cars.detail, slug],
            queryFn: () => carServices.getCarBySlug(slug),
            enabled: !!slug,
        });
    };

    const useGetFeaturedCars = () => {
        return useQuery({
            queryKey: [queryKeys.cars.featured],
            queryFn: carServices.getFeaturedCars,
        });
    };

    return {
        useGetAllCars,
        useGetPublicCars,
        useGetPublicCarsInfinite,
        useGetCarById,
        useGetCarBySlug,
        useGetFeaturedCars
    };
};
