import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Typography, Divider, Badge, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import CartDropdown from './CartDropdown';
import api from '../api/api';
import { Link } from 'react-router-dom';
import '../styles/UserNavbar.css'; // CSS dosyamız

export default function UserNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, logout } = useAuth();
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const searchInputRef = useRef(null);
    const [user, setUser] = useState(null);
    const [searchWidth, setSearchWidth] = useState(0);
    const [searchLeftMargin, setSearchLeftMargin] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchCartItems = async () => {
        try {
            const response = await api.get('/user/my-basket');
            setCartItems(response.data);
            const totalquantity = response.data.reduce((total, item) => total + item.quantity, 0);
            setTotalQuantity(totalquantity);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await api.get('/user/my-account');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        fetchUserDetails();

        const cartInterval = setInterval(fetchCartItems, 100); // Her 10 saniyede bir sepet öğelerini günceller
        const userInterval = setInterval(fetchUserDetails, 100); // Her 10 saniyede bir kullanıcı bilgilerini günceller

        return () => {
            clearInterval(cartInterval);
            clearInterval(userInterval);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1532 && isSearchModalOpen) {
                setSearchModalOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [isSearchModalOpen]);

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

    const handleProfileMenuOpen = () => {
        setProfileMenuOpen(true);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuOpen(false);
    };

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
                                        padding: '10px 0',
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
                    <Box
                        onMouseEnter={handleProfileMenuOpen}
                        onMouseLeave={handleProfileMenuClose}
                        className="profile-menu-container"
                        sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                    >
                        <IconButton color="inherit" onClick={() => navigate('../profilim')}>
                            <PersonOutlineIcon />
                        </IconButton>
                        <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('../profilim')}>
                            Profilim
                        </Typography>
                        {profileMenuOpen && (
                            <Box className="profile-menu" onMouseEnter={handleProfileMenuOpen} onMouseLeave={handleProfileMenuClose}>
                                {user && user.name ? (
                                    <Typography variant="body2" className="profile-menu-user" sx={{ fontWeight: 'bold', color: '#4B0082' }}>
                                        {user.name + ' ' + user.surname}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" className="profile-menu-user" sx={{ fontWeight: 'bold', color: '#4B0082' }}>

                                    </Typography>
                                )}
                                <Divider />
                                <Link to={'/profilim'} style={{ textDecoration: 'none' }}>
                                    <MenuItem className="profile-menu-item">
                                        <ListItemIcon sx={{ minWidth: '30px' }}>
                                            <PersonOutlineIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText className="profile-menu-text" primaryTypographyProps={{ variant: 'body2' }} primary="Hesabım" />
                                    </MenuItem>
                                </Link>
                                <Link to={'/siparislerim'} style={{ textDecoration: 'none' }}>
                                    <MenuItem className="profile-menu-item">
                                        <ListItemIcon sx={{ minWidth: '30px' }}>
                                            <AssignmentIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText className="profile-menu-text" primaryTypographyProps={{ variant: 'body2' }} primary="Siparişlerim" />
                                    </MenuItem>
                                </Link>
                                <Link to={'/sorularim'} style={{ textDecoration: 'none' }}>
                                    <MenuItem className="profile-menu-item">
                                        <ListItemIcon sx={{ minWidth: '30px' }}>
                                            <GradeIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText className="profile-menu-text" primaryTypographyProps={{ variant: 'body2' }} primary="Sorularım" />
                                    </MenuItem>
                                </Link>
                                <Divider />
                                <MenuItem onClick={logout} className="profile-menu-item">
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <ExitToAppIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText className="profile-menu-text" primaryTypographyProps={{ variant: 'body2' }} primary="Çıkış Yap" />
                                </MenuItem>
                            </Box>
                        )}
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
                    <IconButton color="inherit" onClick={() => navigate('/favorilerim')}>
                        <FavoriteIcon />
                    </IconButton>
                    <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/favorilerim')}>
                        Favorilerim
                    </Typography>
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
