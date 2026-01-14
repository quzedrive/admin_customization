import client from '@/lib/api/client';

export const getNotifications = async (page = 1, limit = 20) => {
    const response = await client.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
};

export const markAsRead = async (id: string) => {
    const response = await client.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await client.put('/notifications/read-all');
    return response.data;
};

export const deleteNotification = async (id: string) => {
    const response = await client.delete(`/notifications/${id}`);
    return response.data;
};
