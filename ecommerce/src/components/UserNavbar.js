import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Button, Box ,Badge} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';

export default function Navbar() {
  // İkon stilleri ve renkleri burada özelleştirilebilir
  const iconStyle = {
    color: '#fff',
    marginRight: '10px'
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#4B0082' }}>
      <Toolbar>
        {/* Logo ve slogan */}
        <Box display="flex" alignItems="center" mr={2}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            noVa
          </Typography>
          <Typography variant="subtitle1" noWrap component="div" sx={{ marginLeft: '10px', color: 'yellow' }}>
            Eğlenceli LEGO Setlerini Keşfet
          </Typography>
        </Box>

        {/* Arama çubuğu */}
        <Box sx={{ flexGrow: 1 }}>
          <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '4px', width: '100%' }}>
            <InputBase
              placeholder="Ara..."
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: '10px', width: '100%' }}
            />
            <IconButton type="submit" aria-label="search" style={{ position: 'absolute', right: '0', top: '0', padding: '10px', color: 'gray' }}>
              <SearchIcon />
            </IconButton>
          </div>
        </Box>

        {/* Adres ekle butonu */}
        <Button color="inherit" startIcon={<PersonIcon />} style={{ ...iconStyle, backgroundColor: 'orange', marginLeft: '20px' }}>
          Adres Ekle
        </Button>

        {/* Sepet ve hesap butonları */}
        <IconButton aria-label="show cart items" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Button color="inherit" style={iconStyle}>
          Üye Ol
        </Button>
        <Button color="inherit" style={iconStyle}>
          Giriş Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
}
