import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateItem, deleteItem } from '../redux/cartSlice';
import DeleteIcon from '@mui/icons-material/Delete';

function CartItem({ item }) {
    const dispatch = useDispatch();

    const handleUpdateItem = (quantity) => {
        dispatch(updateItem({ sellerProductId: item.sellerProduct.seller.seller_id, quantity }));
    };

    const handleDeleteItem = () => {
        dispatch(deleteItem(item.seller_product_id));
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
                        <button onClick={() => handleUpdateItem(item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateItem(item.quantity + 1)}>+</button>
                    </div>
                    <div className="price">{item.sellerProduct.price * item.quantity}₺</div>
                    <div className='remove-button' onClick={handleDeleteItem}>
                        <span>Sil</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
