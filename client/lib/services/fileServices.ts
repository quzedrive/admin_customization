import client from '@/lib/api/client';

export const fileServices = {
    uploadFile: async (file: File, folder: string = 'misc'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        // Append folder as a query parameter
        // Do NOT set Content-Type: multipart/form-data manually with axios + FormData.
        // Axios will set it automatically with the correct boundary.
        // But we MUST unset 'application/json' if it's the default.
        const response = await client.post(`/upload?folder=${folder}`, formData, {
            headers: {
                'Content-Type': undefined,
            },
        });

        return response.data.url;
    }
};
