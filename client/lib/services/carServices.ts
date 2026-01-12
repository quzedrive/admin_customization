import client from "../api/client";

const BASE_URL = '/cars';

export const carServices = {
    // Admin: Get all cars
    getAllCars: async () => {
        const response = await client.get(BASE_URL);
        return response.data;
    },

    // Public: Get all public cars
    getPublicCars: async () => {
        const response = await client.get(`${BASE_URL}/public`);
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
};
