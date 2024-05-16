import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';  // API'nizi import edin

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0, // Total quantity
    isLoading: false,
    error: null
};

// Sepeti API'den çekme
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/my-basket');
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
        try {
            const response = await api.post('/user/update-item', itemData);
            return itemData;
        } catch (error) {
            console.error('API error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

//Ürünü sepetten kaldırma
export const deleteItem = createAsyncThunk(
    'cart/deleteItem',
    async (itemData, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/delete-item', itemData);
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
        try {
            const response = await api.post('/user/clear-cart');
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

                console.log('Action Payload:', action.payload);
                console.log('Price:', price);
                console.log('Quantity:', quantity);

                if (quantity === 0) {
                    // Eğer güncellenen miktar sıfırsa, ürünü sepette bulunan ürünler arasından kaldır
                    if (existingItemIndex !== -1) {
                        const deletedItem = state.items[existingItemIndex];

                        if (deletedItem) {
                            console.log('Deleted Item Price:', deletedItem.sellerProduct.price);
                            state.totalAmount -= deletedItem.sellerProduct.price * deletedItem.quantity;
                            state.totalQuantity -= deletedItem.quantity; // Total quantity
                            state.items.splice(existingItemIndex, 1);
                        }
                    }
                } else {
                    if (existingItemIndex !== -1) {
                        // Eğer ürün zaten sepette ise miktarını güncelle
                        const existingItem = state.items[existingItemIndex];

                        if (existingItem) {
                            state.totalAmount -= existingItem.sellerProduct.price * existingItem.quantity; // Önceki miktarı toplam tutardan çıkar
                            state.totalQuantity -= existingItem.quantity; // Total quantity
                            existingItem.quantity = quantity; // Miktarı güncelle
                            state.totalAmount += price * quantity; // Yeni miktarı toplam tutara ekle
                            state.totalQuantity += quantity; // Total quantity
                        }
                    } else {
                        // Eğer ürün sepette değilse yeni ürün olarak ekle
                        state.items.push({ ...action.payload, sellerProduct: { ...sellerProduct, price } });
                        state.totalAmount += price * quantity;
                        state.totalQuantity += quantity; // Total quantity
                    }
                }
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
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
                state.totalQuantity = 0; // Total quantity
            });
    }
});

export const { addItemLocally, removeItemLocally, updateItemQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;


