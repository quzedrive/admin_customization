import client from '@/lib/api/client';

export interface PackageParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
}

export const packageServices = {
    // Admin: Fetch all packages with pagination/search/filter
    getAdminPackages: async (params: PackageParams) => {
        const response = await client.get('/packages/admin', { params });
        return response.data;
    },

    // Public: Fetch active packages
    getPublicPackages: async () => {
        const response = await client.get('/packages');
        return response.data;
    },

    // Admin: Get package by ID
    getPackageById: async (id: string) => {
        const response = await client.get(`/packages/admin/${id}`);
        return response.data;
    },

    // Admin: Create new package
    createPackage: async (data: FormData) => {
        const response = await client.post('/packages/admin?folder=packages', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Admin: Update package
    updatePackage: async ({ id, data }: { id: string; data: FormData }) => {
        const response = await client.put(`/packages/admin/${id}?folder=packages`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Admin: Delete package
    deletePackage: async (id: string) => {
        const response = await client.delete(`/packages/admin/${id}`);
        return response.data;
    }
};
