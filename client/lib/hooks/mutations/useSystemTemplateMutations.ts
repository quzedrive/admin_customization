import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { systemTemplateServices } from '@/lib/services/systemTemplateServices';
import toast from 'react-hot-toast';

export const useSystemTemplateMutations = () => {
    const queryClient = useQueryClient();

    const createTemplateMutation = useMutation({
        mutationFn: systemTemplateServices.createTemplate,
        onSuccess: () => {
            toast.success('Template created successfully');
            queryClient.invalidateQueries({ queryKey: [queryKeys.systemTemplates] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create template');
        },
    });

    const updateTemplateMutation = useMutation({
        mutationFn: systemTemplateServices.updateTemplate,
        onSuccess: () => {
            toast.success('Template updated successfully');
            queryClient.invalidateQueries({ queryKey: [queryKeys.systemTemplates] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update template');
        },
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: systemTemplateServices.deleteTemplate,
        onSuccess: () => {
            toast.success('Template deleted successfully');
            queryClient.invalidateQueries({ queryKey: [queryKeys.systemTemplates] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete template');
        },
    });

    return {
        createTemplateMutation,
        updateTemplateMutation,
        deleteTemplateMutation,
    };
};
