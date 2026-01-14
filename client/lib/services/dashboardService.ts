import client from '@/lib/api/client';

const BASE_URL = '/dashboard';

export const dashboardServices = {
    getStats: async () => {
        const response = await client.get(`${BASE_URL}/stats`);
        return response.data;
    },

    // Admin: Get Dashboard Analytics (Charts)
    getAnalytics: async (period = 'monthly') => {
        const response = await client.get(`${BASE_URL}/analytics`, { params: { period } });
        return response.data;
    },

    getChartData: async (type: string, period: string) => {
        const response = await client.get(`${BASE_URL}/chart-data`, { params: { type, period } });
        return response.data.data;
    }
};
