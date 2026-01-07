import client from '@/lib/api/client';

export interface BrandParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
}

export const brandServices = {
    // Admin: Fetch all brands with pagination/search/filter
    getAdminBrands: async (params: BrandParams) => {
        const response = await client.get('/brands/admin', { params });
        return response.data;
    },

    // Public: Fetch active brands
    getPublicBrands: async (params: BrandParams) => {
        const response = await client.get('/brands', { params });
        return response.data;
    },

    // Admin: Create new brand
    createBrand: async (data: FormData) => {
        const response = await client.post('/brands/admin?folder=brands', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Admin: Update brand
    updateBrand: async ({ id, data }: { id: string; data: FormData }) => {
        const response = await client.put(`/brands/admin/${id}?folder=brands`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Admin: Delete brand
    deleteBrand: async (id: string) => {
        const response = await client.delete(`/brands/admin/${id}`);
        return response.data;
    }
};
