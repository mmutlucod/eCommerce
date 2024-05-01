import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/CartDropdown.css'; // Stiller için CSS dosyası

const CartDropdown = () => {
    const cartItems = useSelector(state => state.cart.items); // cart items'ı global stateden çeker

    console.log(cartItems)

    return (
        <div className="cart-dropdown">
            <div className="cart-title">
                Sepetim ({cartItems.length} Ürün)
            </div>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-image">
                            <img src={item.imageUrl} alt={item.name} />
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
