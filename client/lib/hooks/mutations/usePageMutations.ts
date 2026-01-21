import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pageServices, CreatePageData, UpdatePageData } from '@/lib/services/pageServices';
import { PAGE_KEYS } from '../queries/usePageQueries';
import toast from 'react-hot-toast';

export const usePageMutations = () => {
    const queryClient = useQueryClient();

    const createPage = useMutation({
        mutationFn: (data: CreatePageData) => pageServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGE_KEYS.lists() });
            toast.success('Page created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create page');
        }
    });

    const updatePage = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePageData }) => pageServices.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: PAGE_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: PAGE_KEYS.detail(data.slug) });
            toast.success('Page updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update page');
        }
    });

    const deletePage = useMutation({
        mutationFn: (id: string) => pageServices.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGE_KEYS.lists() });
            toast.success('Page deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete page');
        }
    });

    return {
        createPage,
        updatePage,
        deletePage
    };
};
