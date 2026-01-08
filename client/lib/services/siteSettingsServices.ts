import client from '@/lib/api/client';

const BASE_URL = '/settings/site-settings';

export const siteSettingsServices = {
    // Get all settings
    getSettings: async () => {
        const response = await client.get(BASE_URL);
        return response.data;
    },

    // Update General (Identity + Logos)
    updateGeneral: async (data: any) => {
        const response = await client.put(`${BASE_URL}/general`, data);
        return response.data;
    },

    // Update Contact
    updateContact: async (data: any) => {
        const response = await client.put(`${BASE_URL}/contact`, data);
        return response.data;
    },

    // Update Social
    updateSocial: async (data: any) => {
        const response = await client.put(`${BASE_URL}/social`, data);
        return response.data;
    },

    // Update SEO
    updateSeo: async (data: any) => {
        const response = await client.put(`${BASE_URL}/seo`, data);
        return response.data;
    },

    // Update Maintenance
    updateMaintenance: async (data: any) => {
        const response = await client.put(`${BASE_URL}/maintenance`, data);
        return response.data;
    },

    // Update Base Timing
    updateBaseTiming: async (data: { baseTiming: string }) => {
        const response = await client.put(`${BASE_URL}/base-timing`, data);
        return response.data;
    },

    // Email Configuration
    getEmailConfig: async () => {
        const response = await client.get('/settings/email');
        return response.data;
    },

    updateEmailConfig: async (data: any) => {
        const response = await client.put('/settings/email', data);
        return response.data;
    },

    // Image Upload Configuration
    getImageUploadConfig: async () => {
        const response = await client.get('/settings/image-upload');
        return response.data;
    },

    updateImageUploadConfig: async (data: any) => {
        const response = await client.put('/settings/image-upload', data);
        return response.data;
    }
};
