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
    reducers: {
        // addItemLocally(state, action) {
        //     const existingItem = state.items.find(item => item.id === action.payload.id);
        //     if (existingItem) {
        //         existingItem.quantity += action.payload.quantity;
        //     } else {
        //         state.items.push(action.payload);
        //     }
        //     state.totalAmount += action.payload.price * action.payload.quantity;
        // },
        // removeItemLocally(state, action) {
        //     const index = state.items.findIndex(item => item.id === action.payload);
        //     if (index !== -1) {
        //         state.totalAmount -= state.items[index].price * state.items[index].quantity;
        //         state.items.splice(index, 1);
        //     }
        // },
        updateItemQuantityLocally(state, action) {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.totalAmount -= state.items[index].price * state.items[index].quantity;
                state.items[index].quantity = action.payload.quantity;
                state.totalAmount += state.items[index].price * state.items[index].quantity;
            }
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
            .addCase(updateItem.fulfilled, (state, action) => {
                const { id, quantity, price } = action.payload;
                const existingItemIndex = state.items.findIndex(item => item.id === id);

                if (quantity === 0) {
                    // Eğer güncellenen miktar sıfırsa, ürünü sepette bulunan ürünler arasından kaldır
                    if (existingItemIndex !== -1) {
                        const deletedItem = state.items[existingItemIndex];
                        state.totalAmount -= deletedItem.price * deletedItem.quantity;
                        state.items.splice(existingItemIndex, 1);
                    }
                } else {
                    if (existingItemIndex !== -1) {
                        // Eğer ürün zaten sepette ise miktarını güncelle
                        const existingItem = state.items[existingItemIndex];
                        state.totalAmount -= existingItem.price * existingItem.quantity; // Önceki miktarı toplam tutardan çıkar
                        existingItem.quantity = quantity; // Miktarı güncelle
                        state.totalAmount += price * quantity; // Yeni miktarı toplam tutara ekle
                    } else {
                        // Eğer ürün sepette değilse yeni ürün olarak ekle
                        state.items.push(action.payload);
                        state.totalAmount += price * quantity;
                    }
                }
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                const { cartItemId } = action.payload;
                const updatedItems = state.items.filter(item => item.id !== cartItemId);
                console.log(action.payload);
                // Silinen öğenin fiyatını toplam tutardan çıkar
                const deletedItem = state.items.find(item => item.id === cartItemId);
                if (deletedItem) {
                    state.totalAmount -= deletedItem.price * deletedItem.quantity;
                }

                state.items = updatedItems;
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
            });
    }
});

export const { addItemLocally, removeItemLocally, updateItemQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;
