import client from "../api/client";

const BASE_URL = '/cars';

export const carServices = {
    // Admin: Get all cars
    getAllCars: async () => {
        const response = await client.get(BASE_URL);
        return response.data;
    },

    // Public: Get all public cars
    getPublicCars: async (page = 1, limit = 10, filters?: any) => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (filters) {
            if (filters.brands?.length) queryParams.append('brands', filters.brands.join(','));
            if (filters.types?.length) queryParams.append('types', filters.types.join(','));
            if (filters.transmission?.length) queryParams.append('transmission', filters.transmission.join(','));
            if (filters.fuelType?.length) queryParams.append('fuelType', filters.fuelType.join(','));
            if (filters.capacity?.length) queryParams.append('capacity', filters.capacity.join(','));
        }

        const response = await client.get(`${BASE_URL}/public?${queryParams.toString()}`);
        return response.data;
    },

    // Public: Get car by slug
    getCarBySlug: async (slug: string) => {
        const response = await client.get(`${BASE_URL}/public/${slug}`);
        return response.data;
    },

    // Admin: Get single car by ID
    getCarById: async (id: string) => {
        const response = await client.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Admin: Create car
    createCar: async (data: any) => {
        const response = await client.post(BASE_URL, data);
        return response.data;
    },

    // Admin: Update car
    updateCar: async ({ id, data }: { id: string; data: any }) => {
        const response = await client.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    // Admin: Delete car
    deleteCar: async (id: string) => {
        const response = await client.delete(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Admin: Toggle status
    toggleStatus: async ({ id, status }: { id: string; status?: number }) => {
        const response = await client.patch(`${BASE_URL}/${id}/status`, { status });
        return response.data;
    },

    toggleFeatured: async ({ id, status }: { id: string; status?: number }) => {
        const response = await client.patch(`${BASE_URL}/${id}/featured`, { status });
        return response.data;
    },

    // Public: Get featured cars
    getFeaturedCars: async () => {
        const response = await client.get(`${BASE_URL}/public/featured`);
        return response.data;
    },
};
