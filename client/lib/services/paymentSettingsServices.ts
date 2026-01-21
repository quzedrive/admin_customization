import client from '@/lib/api/client';

const BASE_URL = '/settings/payment';

export const paymentSettingsServices = {
    // Get all settings (Admin)
    getSettings: async () => {
        const response = await client.get(BASE_URL);
        return response.data;
    },

    // Update settings (Admin)
    updateSettings: async (data: any) => {
        const response = await client.put(BASE_URL, data);
        return response.data;
    },

    // Update active method (Admin)
    updateActiveMethod: async (activeMethod: number) => {
        const response = await client.patch(`${BASE_URL}/active-method`, { activeMethod });
        return response.data;
    },

    // Get active method (Public)
    getActiveMethod: async () => {
        const response = await client.get(`${BASE_URL}/active-method`);
        return response.data;
    }
};
