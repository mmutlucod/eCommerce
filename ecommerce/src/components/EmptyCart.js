// EmptyCart.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EmptyCart.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function EmptyCart() {
    return (
        <div className="empty-cart-container">
            <div className="empty-cart-info">
                <ShoppingCartIcon style={{ fontSize: '40px', color: '#4B0082', marginLeft: '400px' }} />
                <p>Sepetinde ürün bulunmamaktadır.</p>
            </div>
            <Link to="/shop" className="start-shopping-button">Alışverişe Başla</Link>
        </div>
    );
}

export default EmptyCart;
