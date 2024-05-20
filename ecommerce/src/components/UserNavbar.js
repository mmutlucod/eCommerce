import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Divider, Button, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import CartDropdown from './CartDropdown';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function UserNavbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Mevcut yol bilgisini almak için
    const { token, logout } = useAuth();
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const searchInputRef = useRef(null);
    const [searchWidth, setSearchWidth] = useState(0);
    const [searchLeftMargin, setSearchLeftMargin] = useState(0);
    const [totalQuantity, seTtotalQuantity] = useState(0);

    const fetchCartItems = async () => {
        try {
            const response = await api.get('/user/my-basket');
            setCartItems(response.data);
            const totalquantity = response.data.reduce((total, item) => total + item.quantity, 0);
            seTtotalQuantity(totalquantity);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        const interval = setInterval(fetchCartItems, 60000); // Her 60 saniyede bir sepet öğelerini günceller

        return () => clearInterval(interval); // Component unmount edildiğinde interval'i temizler
    }, []);

    useEffect(() => {
        const handleResize = () => {
            // Eğer ekran boyutu 1532px altına düşerse ve modal açıksa kapat
            if (window.innerWidth < 1532 && isSearchModalOpen) {
                setSearchModalOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => window.removeEventListener('resize', handleResize);
    }, [isSearchModalOpen]); // Bu hook isSearchModalOpen state'ine bağlı

    const handleOpenSearchModal = () => {
        if (window.innerWidth >= 1532) {
            setSearchModalOpen(true);
        }
    };

    const handleCloseSearchModal = () => setSearchModalOpen(false);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        if (query.length > 0 && window.innerWidth >= 1532) {
            setSearchModalOpen(true);
        } else {
            setSearchModalOpen(false);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/arama/${searchQuery.trim()}`);
        }
    };

    useEffect(() => {
        if (searchInputRef.current) {
            setSearchWidth(searchInputRef.current.clientWidth);
            setSearchLeftMargin(searchInputRef.current.offsetLeft);
        }
    }, []);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#4B0082', paddingY: '8px' }}>
            <Toolbar sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        <Box sx={{ backgroundColor: 'yellow', borderRadius: '4px 0 0 4px', display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4B0082', marginLeft: '5%', paddingX: '15px' }}>
                                noVa
                            </Typography>
                        </Box>
                    </Link>
                    <Box ref={searchInputRef} sx={{ flex: 1, backgroundColor: 'white', borderRadius: '0 5px 0px 0', display: 'flex', alignItems: 'center' }}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <InputBase
                                placeholder="Ürün, kategori, marka ara"
                                inputProps={{ 'aria-label': 'search' }}
                                sx={{
                                    flex: 1,
                                    height: '100%',
                                    '& .MuiInputBase-input': {
                                        marginLeft: '8px',
                                        padding: '10px 0', // Padding eklenerek yazının yukarıya kayması önlenir
                                    },
                                }}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <IconButton type="submit" aria-label="search" sx={{ p: '10px', color: 'gray' }}>
                                <SearchIcon />
                            </IconButton>
                        </form>
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <IconButton color="inherit" onClick={() => navigate('/adres-ekle')}>
                        <LocationOnIcon />
                    </IconButton>
                    <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }}>
                        Teslimat Adresi Ekle
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
                    <IconButton color="inherit" onClick={() => navigate('/profilim')}>
                        <PersonOutlineIcon />
                    </IconButton>
                    {token ? (
                        <>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }}>
                                Profilim
                            </Typography>
                            {/* <Button color="inherit" onClick={logout}>
                                Çıkış Yap
                            </Button> */}
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/kayit-ol')}>
                                Üye Ol
                            </Typography>
                            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/giris-yap')}>
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
                        <Link to='/sepetim' style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Badge badgeContent={totalQuantity} color="secondary">
                                <ShoppingCartIcon sx={{ marginLeft: '10px' }} />
                            </Badge>
                        </Link>
                        {cartDropdownOpen && cartItems.length > 0 && location.pathname !== '/sepetim' && <CartDropdown />}
                    </IconButton>
                </Box>
            </Toolbar>
            <SearchModal
                query={searchQuery}
                open={isSearchModalOpen}
                onClose={handleCloseSearchModal}
                width={searchWidth}
                searchLeftMargin={searchLeftMargin}
            />
        </AppBar>
    );
}
