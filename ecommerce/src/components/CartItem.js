import React from 'react';

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} />
                <span>{item.name}</span>
            </div>
            <div>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div>
                <span>${item.price * item.quantity}</span>
                <button onClick={() => onRemoveItem(item.id)}>Remove</button>
            </div>
        </div>
    );
}

export default CartItem;
