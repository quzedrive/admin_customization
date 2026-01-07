import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import client from '@/lib/api/client';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Login Thunk
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await client.post('/admin/login', credentials);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            // In a real app involving cookies, we might also call an endpoint to clear cookies
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.admin;
                state.accessToken = action.payload.qq_access_token;
                state.error = null;
                // Set header for client
                client.defaults.headers.common['Authorization'] = `Bearer ${action.payload.qq_access_token}`;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
