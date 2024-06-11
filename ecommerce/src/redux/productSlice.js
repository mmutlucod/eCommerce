import api from '../api/api'; // Yukarıdaki axios örneğini içeren dosya
import { createAsyncThunk } from '@reduxjs/toolkit';


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
        setInitialCart(state, action) {
            const { items, totalAmount } = action.payload;
            state.items = items;
            state.totalAmount = totalAmount;
        },
        // Diğer reducer'lar burada...
    }
});

export const { setInitialCart } = cartSlice.actions;
export default cartSlice.reducer;


