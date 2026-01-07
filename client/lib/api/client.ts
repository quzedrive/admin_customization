import axios from 'axios';

const client = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true, // Important for cookies (refresh token)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
client.interceptors.request.use(
    (config) => {
        // Token injection will normally happen via headers set by Redux/Context when user logs in.
        // However, if we need to retrieve from localStorage/store here:
        // const token = store.getState().auth.token; 
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
client.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // Must use withCredentials for cookie to be sent
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.qq_access_token;

                // Update default header for future requests
                client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                // Update authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry original request
                return client(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
