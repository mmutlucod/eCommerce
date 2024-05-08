// import React from 'react';

// function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
//     return (
//         <div className="cart-item">
//             <div className="product-info">
//                 <img src={item.image} alt={item.name} className="product-image" />
//                 <div className="product-details">
//                     <div className="product-name">{item.name}</div>
//                     <div className="seller-rating">Satıcı: {item.seller} <span className="rating">{item.rating}</span></div>
//                     <div className="shipping-info">{item.shipping}</div>
//                     <div className="insurance-option">{item.insurance}</div>
//                 </div>
//             </div>
//             <div className="product-pricing">
//                 <div className="quantity-controls">
//                     <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
//                     <span>{item.quantity}</span>
//                     <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
//                 </div>
//                 <div className="price">{item.price} TL</div>
//                 <button onClick={() => onRemoveItem(item.id)} className="remove-item">Sil</button>
//             </div>
//         </div>
//     );
// }

// export default CartItem;
