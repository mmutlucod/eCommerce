import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';
import api from '../api/api';  // API'nizi import edin

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0, // Total quantity
    isLoading: false,
    error: null
};

// Helper function to get token from local storage
const getToken = () => localStorage.getItem('token');

// Sepeti API'den çekme
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        const token = getToken();
        if (!token) {
            return rejectWithValue('Token bulunamadı. Lütfen giriş yapın.');
        }
        try {
            const response = await api.get('/user/my-basket', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Ürün adet güncelleme
export const updateItem = createAsyncThunk(
    'cart/updateItem',
    async (itemData, { rejectWithValue }) => {
        const token = getToken();
        if (!token) {
            return rejectWithValue('Token bulunamadı. Lütfen giriş yapın.');
        }
        try {
            const response = await api.post('/user/update-item', itemData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return itemData;
        } catch (error) {
            console.error('API error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Ürün ekleme
export const addItem = createAsyncThunk(
    'cart/addItem',
    async (itemData, { rejectWithValue }) => {
        const token = getToken();
        if (!token) {
            return rejectWithValue('Token bulunamadı. Lütfen giriş yapın.');
        }
        try {
            const response = await api.post('/user/add-item', itemData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return itemData;
        } catch (error) {
            console.error('API error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Ürünü sepetten kaldırma
export const deleteItem = createAsyncThunk(
    'cart/deleteItem',
    async (itemData, { rejectWithValue }) => {
        const token = getToken();
        if (!token) {
            return rejectWithValue('Token bulunamadı. Lütfen giriş yapın.');
        }
        try {
            const response = await api.post('/user/delete-item', itemData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return itemData;
        } catch (error) {
            console.error('API error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Sepeti temizleme
export const clearCartAPI = createAsyncThunk(
    'cart/clearCartAPI',
    async (_, { rejectWithValue }) => {
        const token = getToken();
        if (!token) {
            return rejectWithValue('Token bulunamadı. Lütfen giriş yapın.');
        }
        try {
            const response = await api.post('/user/clear-cart', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.totalAmount = action.payload.reduce((total, item) => total + item.sellerProduct.price * item.quantity, 0);
                state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0); // Total quantity
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Veriler yüklenemedi.';
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const { id, quantity, sellerProduct, price } = action.payload;
                const existingItemIndex = state.items.findIndex(item => item.id === id);

                if (quantity === 0) {
                    if (existingItemIndex !== -1) {
                        const deletedItem = state.items[existingItemIndex];
                        if (deletedItem) {
                            state.totalAmount -= deletedItem.sellerProduct.price * deletedItem.quantity;
                            state.totalQuantity -= deletedItem.quantity; // Total quantity
                            state.items.splice(existingItemIndex, 1);
                        }
                    }
                } else {
                    if (existingItemIndex !== -1) {
                        const existingItem = state.items[existingItemIndex];
                        if (existingItem) {
                            state.totalAmount -= existingItem.sellerProduct.price * existingItem.quantity; // Önceki miktarı toplam tutardan çıkar
                            state.totalQuantity -= existingItem.quantity; // Total quantity
                            existingItem.quantity = quantity; // Miktarı güncelle
                            state.totalAmount += price * quantity; // Yeni miktarı toplam tutara ekle
                            state.totalQuantity += quantity; // Total quantity
                        }
                    } else {
                        state.items.push({ ...action.payload, sellerProduct: { ...sellerProduct, price } });
                        state.totalAmount += price * quantity;
                        state.totalQuantity += quantity; // Total quantity
                    }
                }
                enqueueSnackbar('Ürün başarıyla güncellendi.', { variant: 'success', autoHideDuration: 1200 });
            })
            .addCase(updateItem.rejected, (state, action) => {
            })
            .addCase(addItem.fulfilled, (state, action) => {
                const { sellerProductId, quantity, sellerProduct, price } = action.payload;
                const existingItemIndex = state.items.findIndex(item => item.sellerProductId === sellerProductId);

                if (existingItemIndex !== -1) {
                    const existingItem = state.items[existingItemIndex];
                    if (existingItem) {
                        state.totalAmount -= existingItem.sellerProduct.price * existingItem.quantity;
                        state.totalQuantity -= existingItem.quantity;
                        existingItem.quantity += quantity;
                        state.totalAmount += existingItem.sellerProduct.price * existingItem.quantity;
                        state.totalQuantity += existingItem.quantity;
                    }
                } else {
                    state.items.push({ ...action.payload, sellerProduct: { price } });
                    state.totalAmount += price * quantity;
                    state.totalQuantity += quantity;
                }
                enqueueSnackbar('Ürün sepete eklendi.', { variant: 'success', autoHideDuration: 1200 });
            })
            .addCase(addItem.rejected, (state, action) => {
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                const { cartItemId } = action.payload;
                const updatedItems = state.items.filter(item => item.id !== cartItemId);

                const deletedItem = state.items.find(item => item.id === cartItemId);

                if (deletedItem) {
                    state.totalAmount -= deletedItem.sellerProduct.price * deletedItem.quantity;
                    state.totalQuantity -= deletedItem.quantity; // Total quantity
                }

                state.items = updatedItems;
                enqueueSnackbar('Ürün sepetten kaldırıldı.', { variant: 'success', autoHideDuration: 1200 });
            })
            .addCase(deleteItem.rejected, (state, action) => {
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
                state.totalQuantity = 0; // Total quantity
                enqueueSnackbar('Sepet temizlendi.', { variant: 'success', autoHideDuration: 1200 });
            })
            .addCase(clearCartAPI.rejected, (state, action) => {
            });
    }
});

export const { addItemLocally, removeItemLocally, updateItemQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;
