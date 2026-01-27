import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { systemTemplateServices, TemplateParams } from '@/lib/services/systemTemplateServices';

export const useSystemTemplateQueries = () => {
    const useGetAllTemplates = (params?: TemplateParams) => useQuery({
        queryKey: [queryKeys.systemTemplates, params],
        queryFn: () => systemTemplateServices.getAllTemplates(params),
        placeholderData: keepPreviousData,
    });

    const useGetTemplateById = (id: string) => useQuery({
        queryKey: [queryKeys.systemTemplates, id],
        queryFn: () => systemTemplateServices.getTemplateById(id),
        enabled: !!id,
    });

    return {
        useGetAllTemplates,
        useGetTemplateById,
    };
};
