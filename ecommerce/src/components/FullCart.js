import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FullCart.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCartAPI } from '../redux/cartSlice';
import Footer from '../components/UserFooter';
import CartItem from './CartItem';
import DeleteIcon from '@mui/icons-material/Delete';

function groupItemsBySeller(items) {
    return items.reduce((acc, item) => {
        if (!item || !item.sellerProduct || !item.sellerProduct.seller || !item.sellerProduct.seller.username) {
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
    const totalAmount = useSelector((state) => state.cart.totalAmount);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
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
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const itemsBySeller = groupItemsBySeller(cartItems);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    return (
        <>
            <div className="full-cart-container" style={{ marginBottom: '200px', marginTop: '25px' }}>
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
                            <CartItem key={item.id} item={item} />)
                        )}
                    </div>
                ))}
                <div className={`order-summary ${topClass}`}>
                    <h3>Sipariş Özeti</h3>
                    <p>Ürünün Toplamı <span>{totalAmount} ₺</span></p>
                    <p>Kargo Toplamı <span>+34,99 ₺</span></p>
                    <p style={{ color: '#4B0082' }}>Kargo Bedava(Satıcı Karşılar) <span style={{ color: '#4B0082' }}>-34,99 ₺</span></p>
                    <p>Toplam Tutar <span>{totalAmount} ₺</span></p>
                    <Link to="/sepetim/odeme" className="checkout-buttons">Sepeti Onayla</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default FullCart;
