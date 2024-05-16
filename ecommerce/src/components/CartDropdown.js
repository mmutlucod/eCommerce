import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CartDropdown.css';
import api from '../api/api';
import { Link } from 'react-router-dom';


const CartDropdown = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/user/my-basket');
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartItems();
    }, []);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.sellerProduct.price), 0);

    return (
        <div className="cart-dropdown">
            <div className="cart-header0">
                <div className="cart-title">
                    Sepetim ({totalQuantity} Ürün)
                </div>
                <div className="cart-title-2">
                    Toplam:  {totalPrice} ₺
                </div>
            </div>

            <div className="cart-items">
                {cartItems.map(item => (
                    <Link style={{ textDecoration: 'none' }} to={'/urun/' + item.sellerProduct.product.slug}><div key={item.product_id} className="cart-itemX">
                        <div className="item-image">
                            <img src={item.sellerProduct.product.productImages && item.sellerProduct.product.productImages.length > 0 ? `http://localhost:5000/img/${item.sellerProduct.product.productImages[0].image_path}` : 'http://localhost:5000/img/empty.jpg'} alt={item.sellerProduct.product.name} />
                        </div>
                        <div className="item-details0">
                            <div className="item-name">{item.sellerProduct.product.name}</div>
                            <div className="item-options">
                                <div className='item-price'>Fiyat: {item.sellerProduct.price} ₺ </div>
                                <div className='item-quantity'>Adet: {item.quantity} </div>
                            </div>
                        </div>
                    </div>
                    </Link>))}
            </div>
            <div className="buttons-container">
                <Link to="/sepetim" className="view-cart-button button">Sepete Git</Link>
                <Link to="/siparisi-tamamla" className="checkout-button button">Siparişi Tamamla</Link>
            </div>
        </div >
    );
};

export default CartDropdown;
