import client from '@/lib/api/client';

const BASE_URL = '/cancellation-reasons';

export interface CancellationReason {
    _id: string;
    reason: string;
    type: 'user' | 'admin';
    status: number;
    createdAt: string;
    updatedAt: string;
}

export const cancellationReasonServices = {
    // Create
    createReason: async (data: Partial<CancellationReason>) => {
        const response = await client.post(BASE_URL, data);
        return response.data;
    },

    // Get All
    getAllReasons: async (params?: { type?: string }) => {
        const response = await client.get(BASE_URL, { params });
        return response.data;
    },

    // Get One
    getReasonById: async (id: string) => {
        const response = await client.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Update
    updateReason: async (id: string, data: Partial<CancellationReason>) => {
        const response = await client.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    // Delete
    deleteReason: async (id: string) => {
        const response = await client.delete(`${BASE_URL}/${id}`);
        return response.data;
    }
};
