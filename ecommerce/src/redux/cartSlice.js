import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';  // API'nizi import edin

const initialState = {
    items: [],
    totalAmount: 0,
    isLoading: false,
    error: null
};

// Sepeti API'den çekme
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/my-basket');
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Sepeti güncelleme
export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async (cartData, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/update-basket', cartData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Sepeti temizleme
export const clearCartAPI = createAsyncThunk(
    'cart/clearCartAPI',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.delete('/user/clear-basket');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            // addItem reducer kodunuz
        },
        removeItem(state, action) {
            // removeItem reducer kodunuz
        },
        updateItemQuantity(state, action) {
            // updateItemQuantity reducer kodunuz
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload || [];
                state.totalAmount = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Veriler yüklenemedi.';
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.items = action.payload || [];
                state.totalAmount = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
            });
    }
});

export const { addItem, removeItem, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
