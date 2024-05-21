// EmptyCart.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EmptyCart.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Footer from '../components/UserFooter';


function EmptyCart() {
    return (
        <>
            <div className="empty-cart-container" style={{ marginBottom: '150px' }}>
                <div className="empty-cart-info">
                    <ShoppingCartIcon style={{ fontSize: '40px', color: '#4B0082', marginLeft: '40%' }} />
                    <p>Sepetinde ürün bulunmamaktadır.</p>
                </div>
                <Link to="/" className="start-shopping-button">Alışverişe Başla</Link>
            </div>
            <Footer />
        </>
    );
}

export default EmptyCart;
