import { useQuery } from '@tanstack/react-query';
import { pageServices } from '@/lib/services/pageServices';

export const PAGE_KEYS = {
    all: ['pages'] as const,
    lists: () => [...PAGE_KEYS.all, 'list'] as const,
    list: (params: any) => [...PAGE_KEYS.all, 'list', params] as const,
    detail: (slug: string) => [...PAGE_KEYS.all, 'detail', slug] as const,
};

export const usePageQueries = () => {
    // Admin: Get All Pages (Paginated)
    const usePagesList = (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
        return useQuery({
            queryKey: PAGE_KEYS.list(params),
            queryFn: () => pageServices.getAll(params),
            placeholderData: (previousData) => previousData, // Keep previous data while fetching new
        });
    };

    // Public: Get Page by Slug
    const usePageBySlug = (slug: string) => {
        return useQuery({
            queryKey: PAGE_KEYS.detail(slug),
            queryFn: () => pageServices.getBySlug(slug),
            enabled: !!slug, // Only run if slug is provided
            retry: false, // Don't retry if 404
        });
    };

    // Admin: Get Page by Slug
    const useAdminPageBySlug = (slug: string) => {
        return useQuery({
            queryKey: [...PAGE_KEYS.detail(slug), 'admin'],
            queryFn: () => pageServices.getAdminBySlug(slug),
            enabled: !!slug,
            retry: false,
        });
    };

    return {
        usePagesList,
        usePageBySlug,
        useAdminPageBySlug
    };
};
