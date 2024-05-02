import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Divider, Button, Badge, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartDropdown from './CartDropdown';

export default function UserNavbar() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#4B0082', paddingY: '8px' }}>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ backgroundColor: 'yellow', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', py: '6px', px: '16px' }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#4B0082' }}>
                        noVa
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', marginLeft: '2px', position: 'relative' }}>
                    <InputBase
                        placeholder="Ürün, kategori, marka ara"
                        inputProps={{ 'aria-label': 'search' }}
                        sx={{
                            ml: 1,
                            flex: 1,
                            height: '100%',
                            '& .MuiInputBase-input': {
                                textAlign: 'left',
                                width: '100%',
                                height: '100%',
                            },
                        }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <IconButton type="submit" aria-label="search" sx={{ p: '10px', color: 'gray' }} onClick={() => navigate(`/search/${searchQuery}`)}>
                        <SearchIcon />
                    </IconButton>
                    {searchQuery && (
                        <Box sx={{ position: 'absolute', width: '100%', mt: 3, backgroundColor: 'white', boxShadow: 3, borderRadius: '4px', zIndex: 1, overflow: 'auto', maxHeight: '300px' }}>
                            {/* Example data shown, replace with your data fetching and display logic */}
                            <Typography sx={{ p: 2 }}>Sonuçlar: {searchQuery}</Typography>
                            <Link sx={{ display: 'block', p: 2, borderBottom: '1px solid #eee' }}>Örnek Ürün 1</Link>
                            <Link sx={{ display: 'block', p: 2, borderBottom: '1px solid #eee' }}>Örnek Ürün 2</Link>
                            <Link sx={{ display: 'block', p: 2, borderBottom: '1px solid #eee' }}>Örnek Ürün 3</Link>
                        </Box>
                    )}
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <IconButton color="inherit" onClick={() => navigate('/user/address-add')}>
                        <LocationOnIcon />
                    </IconButton>
                    <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }}>
                        Teslimat Adresi Ekle
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
                    <IconButton color="inherit" onClick={() => navigate('/user/profile')}>
                        <PersonOutlineIcon />
                    </IconButton>
                    {token ? (
                        <>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }}>
                                Profilim
                            </Typography>
                            <Button color="inherit" onClick={logout}>
                                Çıkış Yap
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/auth')}>
                                Üye Ol
                            </Typography>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/auth')}>
                                Giriş Yap
                            </Typography>
                        </>
                    )}
                    <IconButton
                        color="inherit"
                        onMouseEnter={() => setCartDropdownOpen(true)}
                        onMouseLeave={() => setCartDropdownOpen(false)}
                        aria-label="show cart items"
                    >
                        <Badge badgeContent={4} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                        {cartDropdownOpen && <CartDropdown />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CartDropdown.css';
import api from '../api/api';

const CartDropdown = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/user/my-basket');
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartItems();
    }, []);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.sellerProduct.price), 0);
    console.log(cartItems)

    return (
        <div className="cart-dropdown">
            <div className="cart-header">
                <div className="cart-title">
                    Sepetim ({totalQuantity} Ürün)
                </div>
                <div className="cart-title-2">
                    Toplam:  {totalPrice} ₺
                </div>
            </div>

            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.product_id} className="cart-item">
                        <div className="item-image">
                            <img src={item.sellerProduct.product.productImages && item.sellerProduct.product.productImages.length > 0 ? `http://localhost:5000/img/${item.sellerProduct.product.productImages[0].image_path}` : 'http://localhost:5000/img/empty.jpg'} alt={item.sellerProduct.product.name} />
                        </div>
                        <div className="item-details">
                            <div className="item-name">{item.sellerProduct.product.name}</div>
                            <div className="item-options">
                                <div className='item-price'>Fiyat: {item.sellerProduct.price} ₺ </div>
                                <div className='item-quantity'>Adet: {item.quantity} </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="buttons-container">
                <button className="view-cart-button button">Sepete Git</button>
                <button className="checkout-button button">Siparişi Tamamla</button>
            </div>
        </div>
>>>>>>> 0cd869a5621372093038d40db96bfb523ec4d917
    );
}
