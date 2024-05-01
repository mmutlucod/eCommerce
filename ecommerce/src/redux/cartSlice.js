// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Sepetteki ürünlerin listesi
    totalAmount: 0 // Toplam ücret
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (existingItem) {
                // Ürün zaten sepette varsa, miktarını arttır
                existingItem.quantity += newItem.quantity;
            } else {
                // Yeni ürün, sepete ekle
                state.items.push({ ...newItem, quantity: newItem.quantity });
            }
            state.totalAmount += newItem.price * newItem.quantity;
        },
        removeItem(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    // Eğer ürün miktarı birden fazla ise, miktarını azalt
                    existingItem.quantity -= 1;
                    state.totalAmount -= existingItem.price;
                } else {
                    // Eğer ürün miktarı bir ise, ürünü sepetten çıkar
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
        }
    }
});

export const { addItem, removeItem, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;

