import client from '@/lib/api/client';

const BASE_URL = '/orders';

export interface OrderParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: number | string; // 'all' or number
    paymentStatus?: number | string; // 'all' or number
    sortBy?: string;
}

export const orderServices = {
    // Public: Create order
    createOrder: async (data: any) => {
        const response = await client.post(`${BASE_URL}`, data);
        return response.data;
    },

    // Admin: Fetch all orders with pagination/filters
    getAdminOrders: async (params: OrderParams) => {
        const response = await client.get(`${BASE_URL}/admin`, { params });
        return response.data;
    },

    // Admin: Update order
    updateOrder: async ({ id, data }: { id: string; data: any }) => {
        const response = await client.put(`${BASE_URL}/admin/${id}`, data);
        return response.data;
    },

    // Admin: Cancel/Delete order
    cancelOrder: async (id: string) => {
        const response = await client.delete(`${BASE_URL}/admin/${id}`);
        return response.data;
    }
};
