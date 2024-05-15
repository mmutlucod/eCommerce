import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItemQuantityLocally, removeItemLocally, clearCartAPI } from '../redux/cartSlice';
import Navbar from './UserNavbar';
import EmptyCart from './EmptyCart';
import FullCart from './FullCart';

function Cart() {
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector(state => state.cart);

    const handleUpdateQuantity = (productId, newQuantity) => {
        dispatch(updateItemQuantityLocally({ id: productId, quantity: newQuantity }));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeItemLocally(productId));
    };

    const handleClearItems = () => {
        dispatch(clearCartAPI());
    };

    const getProductCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <EmptyCart />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <FullCart
                cartItems={cartItems}
                total={getTotalPrice()}
                count={getProductCount()}
                onUpdate={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onClearCart={handleClearItems}
            />
        </>
    );
}

export default Cart;
