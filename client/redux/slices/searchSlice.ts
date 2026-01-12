import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserForm } from '@/types/user';

interface SearchState {
    formData: Partial<UserForm>;
    isSearchActive: boolean;
}

const initialState: SearchState = {
    formData: {
        name: '',
        phone: '',
        tripStart: null,
        tripEnd: null,
        carId: '',
        carName: '',
        carSlug: '',
        location: '',
        message: ''
    },
    isSearchActive: false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchFormData: (state, action: PayloadAction<Partial<UserForm>>) => {
            state.formData = { ...state.formData, ...action.payload };
            if (!action.payload.tripStart && !action.payload.tripEnd) return;
            // Logic to persist date strings if needed, but Redux Toolkit + serializableCheck might complain about Dates.
            // We'll trust the user handles Date objects or ISO strings.
            // Ideally for Redux, we should store ISO strings.
        },
        resetSearchForm: (state) => {
            state.formData = initialState.formData;
            state.isSearchActive = initialState.isSearchActive;
        },
        setIsSearchActive: (state, action: PayloadAction<boolean>) => {
            state.isSearchActive = action.payload;
        }
    },
});

export const { setSearchFormData, resetSearchForm, setIsSearchActive } = searchSlice.actions;
export default searchSlice.reducer;
