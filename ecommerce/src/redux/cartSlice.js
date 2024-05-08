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
                const potentialQuantity = existingItem.quantity + newItem.quantity;
                if (potentialQuantity > newItem.maxBuy) {
                    existingItem.quantity = newItem.maxBuy; // max_buy sınırına ulaştığında miktarı sabitle
                } else {
                    existingItem.quantity = potentialQuantity; // Normal ekleme
                }
            } else {
                const initialQuantity = newItem.quantity > newItem.maxBuy ? newItem.maxBuy : newItem.quantity;
                state.items.push({ ...newItem, quantity: initialQuantity });
            }
            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0); // Toplam tutarı güncelle
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
                if (quantity === 0) {
                    // If quantity is set to 0, remove the item from the cart
                    state.items = state.items.filter(item => item.id !== id);
                }
                const newQuantity = Math.min(item.maxBuy, quantity); // Ürün miktarını 5 ile sınırla
                state.totalAmount += (newQuantity - item.quantity) * item.price; // Toplam tutarı güncelle
                item.quantity = newQuantity; // Miktarı güncelle
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