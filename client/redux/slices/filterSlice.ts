import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    brands: string[];
    types: string[];
    transmission: string[];
    fuelType: string[];
    capacity: string[];
}

const initialState: FilterState = {
    brands: [],
    types: [],
    transmission: [],
    fuelType: [],
    capacity: [],
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
            return { ...state, ...action.payload };
        },
        updateFilter: (state, action: PayloadAction<{ key: keyof FilterState; value: string[] }>) => {
            state[action.payload.key] = action.payload.value;
        },
        resetFilters: (state) => {
            return initialState;
        },
    },
});

export const { setFilters, updateFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
