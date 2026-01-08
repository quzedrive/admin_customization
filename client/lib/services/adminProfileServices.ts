import client from "../api/client";


const BASE_URL = '/admin/profile';

export const adminProfileServices = {
    // Update Profile Image
    updateProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await client.put(`${BASE_URL}/image?folder=profile_pictures`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete Profile Image
    deleteProfileImage: async () => {
        const response = await client.delete(`${BASE_URL}/image`);
        return response.data;
    }
};
