import client from '@/lib/api/client';

export const systemTemplateServices = {
    getAllTemplates: async () => {
        const response = await client.get('/templates');
        return response.data;
    },
    getTemplateById: async (id: string) => {
        const response = await client.get(`/templates/${id}`);
        return response.data;
    },
    createTemplate: async (data: any) => {
        const response = await client.post('/templates', data);
        return response.data;
    },
    updateTemplate: async ({ id, data }: { id: string; data: any }) => {
        const response = await client.put(`/templates/${id}`, data);
        return response.data;
    },
    deleteTemplate: async (id: string) => {
        const response = await client.delete(`/templates/${id}`);
        return response.data;
    },
};
