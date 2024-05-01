import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CartDropdown.css'; // Stiller için CSS dosyası
import api from '../api/api'

const CartDropdown = () => {
    const [cartItems, setCartItems] = useState([]); // Sepet ürünlerini tutacak state

    useEffect(() => {
        // Backend API'den sepet verilerini çeken fonksiyon
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/user/my-basket'); // Backend API'den sepet verilerini çekiyoruz
                setCartItems(response.data); // Gelen verileri state'e kaydediyoruz
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        // Sayfa yüklendiğinde sepet verilerini çek
        fetchCartItems();
    }, []); // useEffect'i sadece bir kez çalıştırmak için boş bağımlılık dizisi kullandık

    return (
        <div className="cart-dropdown">
            <div className="cart-title">
                Sepetim ({cartItems.length} Ürün)
            </div>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.product_id} className="cart-item">
                        <div className="item-image">
                            <img src={item.imageUrl} alt={item.product_name} />
                        </div>
                        <div className="item-details">
                            <div className="item-name">{item.name}</div>
                            <div className="item-options">
                                Beden: {item.size} | Adet: {item.quantity}
                            </div>
                            <div className="item-price">{item.price} TL</div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="checkout-button">Siparişi Tamamla</button>
            <button className="view-cart-button">Sepete Git</button>
        </div>
    );
};

export default CartDropdown;
