import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateItem, deleteItem } from '../redux/cartSlice';
import '../styles/CartItem.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CartItem({ item }) {
    const dispatch = useDispatch();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Satıcı stok miktarı ile max_buy değerini karşılaştır ve hangisi küçükse onu maksimum değer olarak al
    const maxQuantity = Math.min(item.sellerProduct.product.max_buy, item.sellerProduct.stock);

    const handleUpdateItem = (quantity) => {
        if (quantity === maxQuantity) {
            setShowNotification(true);
            setNotificationMessage(maxQuantity === item.sellerProduct.stock
                ? 'Bu satıcıdan daha fazla ürün stokta yok.'
                : 'Maksimum ürün adedine ulaştınız.');
        }
        if (quantity <= 0) {
            handleDeleteItem();
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
        handleUpdateItem(item.quantity + 1);
    };

    const handleDecreaseQuantity = () => {
        handleUpdateItem(item.quantity - 1);
    };

    const handleCloseAlert = () => {
        setShowNotification(false);
    };

    const productImage = item.sellerProduct.product.productImages && item.sellerProduct.product.productImages.length > 0
        ? `http://localhost:5000/img/${item.sellerProduct.product.productImages[0].image_path}`
        : 'http://localhost:5000/img/empty.jpg';

    return (
        <div className="item-body">
            <Snackbar open={showNotification} autoHideDuration={3000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    {notificationMessage}
                </Alert>
            </Snackbar>
            <img src={productImage} alt={item.productName} />
            <div className="item-details">
                <p style={{ minWidth: '40%', maxWidth: '40%', fontSize: '14px', marginLeft: '2%', marginTop: '0.32%' }}>
                    <Link className='markaLink' to={'/marka/' + item.sellerProduct.product.Brand.slug}>
                        {item.sellerProduct.product.Brand.brand_name}
                    </Link>
                    {' ' + item.sellerProduct.product.name}
                </p>
                <div className="item-controls">
                    <div className="quantity-selector">
                        <button onClick={handleDecreaseQuantity}>-</button>
                        <div className="quantityWrapper">
                            <span>{item.quantity}</span>
                            {item.quantity === maxQuantity && (
                                <div className="maxQuantity">Max</div>
                            )}
                        </div>
                        <button onClick={handleIncreaseQuantity} disabled={item.quantity === maxQuantity}>+</button>
                    </div>
                    <div className='price'>{item.sellerProduct.price * item.quantity} ₺</div>
                    <div className='remove-button' onClick={handleDeleteItem}>
                        <span>Sil</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
