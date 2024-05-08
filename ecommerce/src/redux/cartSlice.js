// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Sepetteki ürünlerin listesi
    totalAmount: 0, // Toplam ücret
    isLoading: false, // Yükleme durumu
    error: null // Hata durumu
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push({ ...newItem, quantity: newItem.quantity });
            }
            state.totalAmount += newItem.price * newItem.quantity;
        },
        removeItem(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                    state.totalAmount -= existingItem.price;
                } else {
                    state.items = state.items.filter(item => item.id !== id);
                    state.totalAmount -= existingItem.price;
                }
            }
        },
        updateItemQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                state.totalAmount += (quantity - item.quantity) * item.price;
                item.quantity = quantity;
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalAmount = 0;
        }
    }
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;