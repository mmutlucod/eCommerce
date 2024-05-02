// import api from './api'; // Yukarıdaki axios örneğini içeren dosya

// // cartSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     items: [], // Sepetteki ürünlerin listesi
//     totalAmount: 0 // Toplam ücret
// };

// const cartSlice = createSlice({
//     name: 'cart',
//     initialState,
//     reducers: {
//         setInitialCart(state, action) {
//             const { items, totalAmount } = action.payload;
//             state.items = items;
//             state.totalAmount = totalAmount;
//         },
//         // Diğer reducer'lar burada...
//     }
// });

// export const { setInitialCart } = cartSlice.actions;
// export default cartSlice.reducer;

// // Redux thunk kullanarak backend API'den verileri çeken ve setInitialCart aksiyonunu dispatch eden bir action creator
// export const fetchCartData = () => async (dispatch) => {
//     try {
//         const response = await api.get('/user/my-basket'); // Backend API'den cart verilerini çekiyoruz
//         dispatch(setInitialCart(response.data)); // Çekilen verileri Redux store'una setInitialCart ile atıyoruz
//     } catch (error) {
//         console.error('Error fetching cart data:', error);
//         // Hata durumunda herhangi bir geri bildirim yapmadan sadece hatayı console'a yazdırabiliriz
//         // Ayrıca, isteği yeniden deneme veya kullanıcıya bir hata mesajı gösterme gibi başka işlemler de yapılabilir
//     }
// };
