import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Box,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountCircle,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; 

const StyledMenuButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',
  margin: theme.spacing(1),
  '& .menu-arrow': {
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
    }),
  },
  '&.open .menu-arrow': {
    transform: 'rotate(180deg)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(13),
  padding: theme.spacing(2),
}));

export default function SellerNavbar() {
  const [anchorEls, setAnchorEls] = useState({});
  const [openMenuTitle, setOpenMenuTitle] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { title: 'ÜRÜN', subItems: [
    { name: 'Marka Tanımla', path: '/seller/seller-add' }
    ,{ name: 'Urunlerim', path: '/seller/product' }, 
    { name: 'Ürün Ekle', path: '/seller/urun-ekle' }] },
    { title: 'SİPARİŞ & KARGO', subItems: [
    { name: 'Siparişlerim', path: '/seller/orders' },
    { name: 'Sorular ve Cevaplar', path: '/seller/question' }] },
   
  ];

  const handleMenuOpen = (event, title) => {
    setAnchorEls({
      ...anchorEls,
      [title]: event.currentTarget
    });
    setOpenMenuTitle(title);
  };

  const handleMenuClose = () => {
    setAnchorEls({});
    setOpenMenuTitle('');
  };

  const handleSubItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const { logoutSeller } = useAuth();

  const handleLogoClick = () => {
    navigate('/seller/dashboard');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#004d40' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography 
          variant="h6" 
          noWrap 
          sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          noVa
        </Typography>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
          {menuItems.map((menuItem) => (
            <React.Fragment key={menuItem.title}>
              <StyledMenuButton
                aria-controls={`menu-${menuItem.title}`}
                aria-haspopup="true"
                onMouseOver={(event) => handleMenuOpen(event, menuItem.title)}
                onClick={(event) => handleMenuOpen(event, menuItem.title)}
                className={openMenuTitle === menuItem.title ? 'open' : ''}
              >
                {menuItem.title}
                <span className="menu-arrow">
                  {openMenuTitle === menuItem.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </span>
              </StyledMenuButton>
              <Menu
                id={`menu-${menuItem.title}`}
                anchorEl={anchorEls[menuItem.title]}
                keepMounted
                open={Boolean(anchorEls[menuItem.title])}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose }}
                PaperProps={{
                  sx: {
                    bgcolor: 'black', // Arka plan rengini siyah yapar
                    color: 'white', // Metin rengini beyaz yapar
                  }
                }}
              >
                {menuItem.subItems.map((subItem) => (
                  <StyledMenuItem key={subItem.name} onClick={() => handleSubItemClick(subItem.path)}>
                    {subItem.name}
                  </StyledMenuItem>
                ))}
              </Menu>
            </React.Fragment>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button color="inherit" onClick={logoutSeller}>Çıkış</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
