import client from '@/lib/api/client';

export const appearanceSettingsServices = {
    // Get Appearance Settings
    getAppearanceSettings: async () => {
        const response = await client.get('/settings/appearance');
        return response.data;
    },

    // Update Appearance Settings
    updateAppearanceSettings: async (data: any) => {
        const response = await client.put('/settings/appearance', data);
        return response.data;
    },
};
