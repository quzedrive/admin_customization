import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { systemTemplateServices } from '@/lib/services/systemTemplateServices';

export const useSystemTemplateQueries = () => {
    const useGetAllTemplates = () => useQuery({
        queryKey: [queryKeys.systemTemplates],
        queryFn: systemTemplateServices.getAllTemplates,
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
