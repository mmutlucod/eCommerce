import React from 'react';
import { AppBar, Toolbar, Button,IconButton, InputBase, Box, Badge, Typography, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person'; // Profil ikonu için
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
    let navigate = useNavigate();
    const { token, logout } = useAuth();
  return (
    <AppBar position="static" sx={{ backgroundColor: '#4B0082', paddingY: '8px' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Box sx={{ backgroundColor: 'yellow', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', py: '6px', px: '16px' }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#4B0082' }}>
            noVa
          </Typography>
        </Box>
        {/* Arama Çubuğu */}
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
          />
          <IconButton type="submit" aria-label="search" sx={{ p: '10px', color: 'gray' }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/* Dikey Ayırıcı */}
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
        {/* Diğer Navbar Öğeleri */}
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          {/* Profil ve Ayarlar */}
          <IconButton color="inherit">
            <LocationOnIcon />
          </IconButton>
          <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/address-add')}>
            Teslimat Adresi Ekle
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
          {token ? (
          <>
            <Typography vvariant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/profile')} style={{ cursor: 'pointer' }}>
              Profilim
            </Typography>
            <Button color="inherit" onClick={logout}>Çıkış Yap</Button>
          </>
        ) : (
          // Kullanıcı giriş yapmamışsa gösterilecek kısım
          <>
            <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/auth')}>
            Üye Ol
          </Typography>
          <Typography variant="body2" noWrap sx={{ mx: 1, cursor: 'pointer' }} onClick={() => navigate('/user/auth')} >
            Giriş Yap
          </Typography>
          </>
        )}
          
          {/* Dikey Ayırıcı */}
          
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', mx: 2 }} />
          {/* Sepet */}
          <IconButton aria-label="show cart items" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
