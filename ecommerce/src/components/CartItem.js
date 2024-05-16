import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateItem, deleteItem } from '../redux/cartSlice';
import '../styles/CartItem.css';  // CSS dosyasını import edin

function CartItem({ item }) {
    const dispatch = useDispatch();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Satıcı stok miktarı ile max_buy değerini karşılaştır ve hangisi küçükse onu maksimum değer olarak al
    const maxQuantity = Math.min(item.sellerProduct.product.max_buy, item.sellerProduct.stock);

    const handleUpdateItem = (item, quantity) => {
        if (quantity > maxQuantity) {
            setShowNotification(true);
            setNotificationMessage(maxQuantity === item.sellerProduct.stock
                ? 'Bu satıcıdan daha fazla ürün stokta yok.'
                : 'Maksimum ürün adedine ulaştınız.');
            return;
        }
        if (quantity <= 0) {
            handleDeleteItem(item);
            return;
        }
        dispatch(updateItem({ id: item.id, sellerProductId: item.seller_product_id, quantity: quantity, price: item.sellerProduct.price }));
    };

    const handleDeleteItem = () => {
        dispatch(deleteItem({ cartItemId: item.id }));
    };

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000); // 3 saniye sonra kaybolur

            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [showNotification]);

    const handleIncreaseQuantity = () => {
        if (item.quantity <= maxQuantity) {
            handleUpdateItem(item, item.quantity + 1);
            setShowNotification(true);
            setNotificationMessage(maxQuantity === item.sellerProduct.stock
                ? 'Bu satıcıdan daha fazla ürün stokta yok.'
                : 'Maksimum ürün adedine ulaştınız.');
        } else {
            setShowNotification(true);
            setNotificationMessage(maxQuantity === item.sellerProduct.stock
                ? 'Bu satıcıdan daha fazla ürün stokta yok.'
                : 'Maksimum ürün adedine ulaştınız.');
        }
    };

    return (
        <div className="item-body">
            <img src={item.productPhoto ? `http://localhost:5000/img/${item.productPhoto}` : 'http://localhost:5000/img/empty.jpg'} alt={item.productName} />
            <div className="item-details">
                <p style={{ minWidth: '40%', maxWidth: '40%', fontSize: '14px', marginLeft: '2%', marginTop: '0.32%' }}>
                    <Link className='markaLink' to={'/marka/' + item.sellerProduct.product.Brand.slug}>
                        {item.sellerProduct.product.Brand.brand_name}
                    </Link>
                    {' ' + item.sellerProduct.product.name}
                </p>
                <div className="item-controls">
                    <div className="quantity-selector">
                        <button onClick={() => handleUpdateItem(item, item.quantity - 1)}>-</button>
                        <div className="quantityWrapper">
                            <span>{item.quantity}</span>
                            {item.quantity === maxQuantity && (
                                <div className="maxQuantity">Max</div>
                            )}
                        </div>
                        <button onClick={handleIncreaseQuantity} disabled={item.quantity >= maxQuantity}>+</button>
                    </div>
                    <div className='price'>{item.sellerProduct.price * item.quantity} ₺</div>
                    <div className='remove-button' onClick={handleDeleteItem}>
                        <span>Sil</span>
                    </div>
                </div>
            </div>
            {showNotification && (
                <div className="notification">
                    {notificationMessage}
                </div>
            )}
        </div>
    );
}

export default CartItem;
