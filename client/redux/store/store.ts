import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import searchReducer from '../slices/searchSlice';
import filterReducer from '../slices/filterSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        filter: filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
