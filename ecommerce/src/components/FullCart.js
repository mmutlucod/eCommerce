import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FullCart.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function CartIcon({ itemCount }) {
    return (
        <div className="cart-icon">
            <i className="fa fa-shopping-cart"></i>
            <span className="item-count">{itemCount}</span>
        </div>
    );
}

function groupItemsBySeller(items) {
    return items.reduce((acc, item) => {
        const sellerUsername = item.sellerProduct.seller.username;
        if (!acc[sellerUsername]) {
            acc[sellerUsername] = [];
        }
        acc[sellerUsername].push(item);
        return acc;
    }, {});
}

function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="item-body">
            <img src={item.sellerProduct.product.productImages && item.sellerProduct.product.productImages.length > 0 ? `http://localhost:5000/img/${item.sellerProduct.product.productImages[0].image_path}` : 'http://localhost:5000/img/empty.jpg'} alt={item.sellerProduct.product.name} />
            <div className="item-details">
                <p style={{ fontSize: '24px', marginLeft: '2%', marginTop: '0.32%' }}>{item.sellerProduct.product.name}</p>
                <div className="item-controls">
                    <div className="price">{item.sellerProduct.price} ₺</div>
                    <div className="quantity-selector">
                        <button onClick={() => onUpdate(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdate(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="remove-button">Sil</button>
                </div>
            </div>
        </div>
    );
}

function FullCart({ cartItems, total, onUpdate, onRemove }) {
    const itemsBySeller = groupItemsBySeller(cartItems);

    return (
        <div className="full-cart-container">
            <div className='item-count'>
                <ShoppingCartIcon style={{ display: 'flex', fontSize: '40px', color: '#4B0082', marginLeft: '2%' }} />Sepetim (5 Ürün)</div>
            {Object.entries(itemsBySeller).map(([seller, items]) => (
                <div className="cart-item" key={seller}>
                    <div className="cart-header">
                        <div>Satıcı:  <Link className='seller-link'>{seller}</Link>
                        </div>
                    </div>
                    {items.map(item => (
                        <CartItem key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
                    ))}
                </div>
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
