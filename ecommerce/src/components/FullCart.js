import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FullCart.css';

function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="product-image" />
            <div className="product-details">
                <h3>{item.name}</h3>
                <p className="seller">Satıcı: {item.seller}</p>
                <p className="price">{item.price} TL</p>
                <div className="quantity-selector">
                    <button onClick={() => onUpdate(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdate(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => onRemove(item.id)} className="remove-button">Sil</button>
            </div>
        </div>
    );
}

function FullCart({ cartItems, total, onUpdate, onRemove }) {
    return (
        <div className="full-cart-container">
            {cartItems.map(item => (
                <CartItem key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
            ))}
            <div className="order-summary">
                <h3>Sipariş Özeti</h3>
                <p>Toplam Ürün Sayısı: {cartItems.length}</p>
                <p>Toplam Tutar: {total} TL</p>
                <Link to="/checkout" className="checkout-buttons">Sepeti Onayla</Link>
            </div>
        </div>
    );
}

export default FullCart;
