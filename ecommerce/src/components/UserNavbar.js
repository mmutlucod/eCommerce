import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Divider, Button, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import CartDropdown from './CartDropdown';  // CartDropdown komponentini import etmeyi unutmayın
import api from '../api/api'

export default function UserNavbar() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);  // Sepet dropdown için state
    const [cartItemCount, setCartItemCount] = useState(0);

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


    const handleOpenSearchModal = () => setSearchModalOpen(true);
    const handleCloseSearchModal = () => setSearchModalOpen(false);
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setDropdownOpen(true);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#4B0082', paddingY: '8px' }}>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ backgroundColor: 'yellow', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', py: '6px', px: '16px' }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#4B0082' }}>
                        noVa
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
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
                    <IconButton type="submit" aria-label="search" sx={{ p: '10px', color: 'gray' }} onClick={handleOpenSearchModal}>
                        <SearchIcon />
                    </IconButton>
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
                        <Badge badgeContent={totalQuantity} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                        {cartDropdownOpen && <CartDropdown />}
                    </IconButton>
                </Box>
            </Toolbar>
            <SearchModal query={searchQuery} open={dropdownOpen} />
            <SearchModal open={isSearchModalOpen} onClose={handleCloseSearchModal} />
        </AppBar>
    );
}
