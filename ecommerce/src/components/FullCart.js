import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FullCart.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete'; // Çöp kutusu ikonu için MUI kütüphanesinden DeleteIcon'u içe aktar
import Footer from '../components/UserFooter';
import { clearCartAPI, updateCart } from '../redux/cartSlice';

function groupItemsBySeller(items) {
    return items.reduce((acc, item) => {
        console.log(item); // Hangi ürünün işlendiğini görmek için
        if (!item || !item.sellerProduct.seller.username) {
            console.error('Seller adı veya ürün eksik:', item);
            return acc; // Eksik veri varsa, bu item'i atlayın
        }
        const sellerUsername = item.sellerProduct.seller.username; // Düzeltme: sellerName olarak değiştirildi
        if (!acc[sellerUsername]) {
            acc[sellerUsername] = [];
        }
        acc[sellerUsername].push(item);
        return acc;
    }, {});

}


function CartItem({ item, onUpdate, onRemove }) {
    console.log(item);
    return (
        <div className="item-body">
            <img src={item.productPhoto ? `http://localhost:5000/img/${item.productPhoto}` : 'http://localhost:5000/img/empty.jpg'} alt={item.productName} />
            <div className="item-details">
                <p style={{ minWidth: '40%', maxWidth: '40%', fontSize: '14px', marginLeft: '2%', marginTop: '0.32%' }}> <Link className='markaLink' to={'/marka/' + item.sellerProduct.product.Brand.slug}>{item.sellerProduct.product.Brand.brand_name}</Link>{' ' + item.sellerProduct.product.name}</p>
                <div className="item-controls">
                    <div className="quantity-selector">
                        <button onClick={() => onUpdate(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdate(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="price">{item.sellerProduct.price * item.quantity}₺</div>
                    <div className='remove-button' onClick={() => onRemove(item.id)}>Sil</div>
                </div>
            </div>
        </div>
    );
}

function FullCart({ cartItems, total, onUpdate, onRemove, onClearCart }) {
    const [topClass, setTopClass] = useState('top-normal'); // Başlangıç sınıfı

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
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.sellerProduct.price * item.quantity, 0);

    return (
        <>
            <div className="full-cart-container">
                <div className='item-count'>
                    {/* <ShoppingCartIcon style={{ fontSize: '40px', color: '#4B0082', marginLeft: '2%' }} /> */}
                    <div className='basket-text'>Sepetim ({totalQuantity} Ürün)</div>
                    <div className="clear-cart" onClick={onClearCart}>
                        <div>
                            <DeleteIcon /> {/* Çöp kutusu ikonu */}
                            <span>Sepeti Boşalt</span>
                        </div>
                    </div>
                </div>

                {Object.entries(itemsBySeller).map(([seller, items]) => (
                    <div className="cart-item" key={seller}>
                        <div className="cart-header">
                            <div>Satıcı:  <Link to={'/satici/' + seller} className='seller-link'>{seller}</Link></div>
                        </div>
                        {items.map(item => (
                            <CartItem key={item.id} item={item} onUpdate={updateCart} onRemove={clearCartAPI} />
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
