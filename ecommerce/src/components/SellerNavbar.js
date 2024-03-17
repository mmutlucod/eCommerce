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
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenuTitle, setOpenMenuTitle] = useState('');
    const [selectedSubItem, setSelectedSubItem] = useState('');
    const [brands, setBrands] = useState([]);
  
    // Menü açma işleyicisi
    const handleMenuOpen = (event, title) => {
      setAnchorEl(event.currentTarget);
      setOpenMenuTitle(title);
    };
  
    // Menü kapatma işleyicisi
    const handleMenuClose = () => {
      setAnchorEl(null);
      setOpenMenuTitle('');
    };
  
    // Alt menü öğesine tıklama işleyicisi
    const handleSubItemClick = (subItem) => {
      setSelectedSubItem(subItem);
      if (subItem === 'Kategori 1') {
        fetchBrands(); // Eğer "Kategori 1" seçildiyse, markaları çek
      }
      handleMenuClose(); // Menüyü kapat
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
                  <StyledMenuItem key={subItem} onClick={() => handleSubItemClick(subItem)}>
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
      {/* Kategori 1 seçildiğinde ve markalar varsa, markaları göster */}
      {selectedSubItem === 'Kategori 1' && brands.length > 0 && (
        <Box sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h5">Markalar</Typography>
          <ul>
            {brands.map((brand) => (
              <li key={brand.id}>{brand.name}</li>
            ))}
          </ul>
        </Box>
      )}
    </AppBar>
  );

}
