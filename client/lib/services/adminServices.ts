import client from '@/lib/api/client';

export const adminServices = {
    login: async (credentials: any) => {
        const response = await client.post('/admin/login', credentials);
        return response.data;
    },
    getMe: async () => {
        const response = await client.get('/admin/me');
        return response.data;
    },
    logout: async () => {
        const response = await client.post('/admin/logout');
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await client.post('/admin/forgotpassword', { email });
        return response.data;
    },
    resetPassword: async ({ token, password }: { token: string; password: string }) => {
        const response = await client.put(`/admin/resetpassword/${token}`, { password });
        return response.data;
    }
};
