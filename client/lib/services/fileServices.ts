import client from '@/lib/api/client';

export const fileServices = {
    uploadFile: async (file: File, folder: string = 'misc'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        // Append folder as a query parameter
        const response = await client.post(`/upload?folder=${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Backend upload response:', response.data); // DEBUG LOG
        return response.data.url;
    }
};
