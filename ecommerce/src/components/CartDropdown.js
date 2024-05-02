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
    );
}
