import client from '@/lib/api/client';

export interface TemplateParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | number;
}

export const systemTemplateServices = {
    getAllTemplates: async (params?: TemplateParams) => {
        const response = await client.get('/system-templates', { params });
        return response.data;
    },
    getTemplateById: async (id: string) => {
        const response = await client.get(`/system-templates/${id}`);
        return response.data;
    },
    createTemplate: async (data: any) => {
        const response = await client.post('/system-templates', data);
        return response.data;
    },
    updateTemplate: async ({ id, data }: { id: string; data: any }) => {
        const response = await client.put(`/system-templates/${id}`, data);
        return response.data;
    },
    deleteTemplate: async (id: string) => {
        const response = await client.delete(`/system-templates/${id}`);
        return response.data;
    },
};
