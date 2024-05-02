import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import api from '../api/api';  // Axios instance'ınızın olduğu dosyadan import ediniz
import Navbar from './UserNavbar';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const response = await api.get('/cart');
                setCartItems(response.data);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await api.put(`/cart/${productId}`, {
                quantity: newQuantity
            });
            if (response.status === 200) {
                setCartItems(cartItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                ));
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await api.delete(`/cart/${productId}`);
            if (response.status === 200) {
                setCartItems(cartItems.filter(item => item.id !== productId));
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (cartItems.length === 0) {
        return (<>
            <Navbar /><div>Your cart is empty.</div> </>);
    }

    return (<>
        <Navbar />
        <div>

            <h2>Your Shopping Cart</h2>
            {cartItems.map(item => (
                <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                />
            ))}
            <div>Total: ${getTotalPrice()}</div>
            <button>Checkout</button>
        </div>
    </>
    );
}

export default Cart;
