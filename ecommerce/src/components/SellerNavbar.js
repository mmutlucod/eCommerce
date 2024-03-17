import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Box,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountCircle,
  Mail as MailIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api from '../api/api'; // api konfigürasyonunu içe aktarın
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
    fontSize: theme.typography.pxToRem(13), // Küçük font boyutu
    padding: theme.spacing(2), // Daha az padding
  }));
  export default function SellerNavbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openMenuTitle, setOpenMenuTitle] = React.useState('');
    const [brands, setBrands] = useState([]);
  
    const handleMenuOpen = (event, title) => {
      setAnchorEl(event.currentTarget);
      setOpenMenuTitle(title);
      if (title === 'ÜRÜN') {
        fetchBrands(); // Kategori 1'e tıkladığında markaları çek
      }
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setOpenMenuTitle('');
    };
  
    const fetchBrands = async () => {
      try {
        const response = await api.get('seller/brands');
        setBrands(response.data); // API'den dönen veri yapısına bağlı olarak ayarlayın
      } catch (error) {
        console.error('Markaları çekerken hata oluştu:', error);
      }
    };

  const menuItems = [
    { title: 'ÜRÜN', subItems: ['Marka Tanımla', 'Kategori 2', 'Kategori 3'] },
    { title: 'SİPARİŞ & KARGO', subItems: ['Sipariş Takibi', 'Kargo Seçenekleri'] },
    { title: 'FİNANS', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
    { title: 'PROMOSYONLAR', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
    { title: 'RAPORLAR', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
    // Diğer menü öğeleri...
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: '#004d40' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
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
    {/* Ok ikonu menü açık ise yukarı, değilse aşağı bakacak şekilde koşullu render */}
    <span className="menu-arrow">
    {openMenuTitle === menuItem.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
  </span>
  </StyledMenuButton>
              <Menu
               PaperProps={{
                sx: {
                  bgcolor: 'secondary.main', // Özel arka plan rengi
                  color: 'common.white', // Yazı rengi
                  boxShadow: 3, // Gölgelendirme derinliği
                }
              }}
                id={`menu-${menuItem.title}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl) && openMenuTitle === menuItem.title}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose }}
              >
                 {menuItem.subItems.map((subItem) => (
                  <StyledMenuItem key={subItem} onClick={handleMenuClose}>
                    {subItem}
                  </StyledMenuItem>
                ))}
              </Menu>
            </React.Fragment>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={17} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
