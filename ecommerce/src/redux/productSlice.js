// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api'; // api dosyanızın yolunu doğru şekilde belirtiniz

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    try {
        const response = await api.get('/user/my-basket'); // API'nizin ürünler endpoint'i
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            });
    }
});

export default productsSlice.reducer;
