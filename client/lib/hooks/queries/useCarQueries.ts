import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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
            queryFn: () => carServices.getPublicCars(),
        });
    };

    const useGetPublicCarsInfinite = (limit = 10) => {
        return useInfiniteQuery({
            queryKey: [queryKeys.cars.publicList, 'infinite', limit],
            queryFn: ({ pageParam = 1 }) => carServices.getPublicCars(pageParam as number, limit),
            getNextPageParam: (lastPage: any) => {
                if (lastPage.pagination.page < lastPage.pagination.pages) {
                    return lastPage.pagination.page + 1;
                }
                return undefined;
            },
            initialPageParam: 1,
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
