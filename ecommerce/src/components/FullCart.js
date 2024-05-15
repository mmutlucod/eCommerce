import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FullCart.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartAPI } from '../redux/cartSlice';
import Footer from '../components/UserFooter';
import CartItem from './CartItem';
import DeleteIcon from '@mui/icons-material/Delete';

function groupItemsBySeller(items) {
    return items.reduce((acc, item) => {
        if (!item || !item.sellerProduct || !item.sellerProduct.seller || !item.sellerProduct.seller.username) {
            console.error('Eksik veri:', item);
            return acc;
        }
        const sellerUsername = item.sellerProduct.seller.username;
        if (!acc[sellerUsername]) {
            acc[sellerUsername] = [];
        }
        acc[sellerUsername].push(item);
        return acc;
    }, {});
}

function FullCart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const [topClass, setTopClass] = useState('top-normal');

    const handleScroll = () => {
        if (window.scrollY > 45) {
            setTopClass('top-small');
        } else {
            setTopClass('top-normal');
        }
    };

    useEffect(() => {
        const itemsBySeller = groupItemsBySeller(cartItems);
        const totalQuantity = cartItems.reduce((sum, item) => sum + (item ? item.quantity : 0), 0);
        const totalPrice = cartItems.reduce((total, item) => total + (item ? item.sellerProduct.price * item.quantity : 0), 0);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <>
            <div className="full-cart-container">
                <div className='item-count'>
                    <div className='basket-text'>Sepetim ({totalQuantity} Ürün)</div>
                    <div className="clear-cart" onClick={() => dispatch(clearCartAPI())}>
                        <div>
                            <DeleteIcon />
                            <span>Sepeti Boşalt</span>
                        </div>
                    </div>
                </div>

                {Object.entries(itemsBySeller).map(([seller, items]) => (
                    <div className="cart-item" key={seller}>
                        <div className="cart-header">
                            <div>Satıcı: <Link to={'/satici/' + seller} className='seller-link'>{seller}</Link></div>
                        </div>
                        {items.map(item => (
                            <CartItem key={item.sellerProduct.seller.seller_id} item={item} />
                        ))}
                    </div>
                ))}
                <div className={`order-summary ${topClass}`}>
                    <h3>Sipariş Özeti</h3>
                    <p>Ürünün Toplamı <span>{totalPrice} ₺</span></p>
                    <p>Kargo Toplamı <span>+34,99 ₺</span></p>
                    <p style={{ color: '#4B0082' }}>Kargo Bedava(Satıcı Karşılar) <span style={{ color: '#4B0082' }}>-34,99 ₺</span></p>
                    <p>Toplam Tutar <span>{totalPrice} ₺</span></p>
                    <Link to="sepetim/odeme" className="checkout-buttons">Sepeti Onayla</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default FullCart;
