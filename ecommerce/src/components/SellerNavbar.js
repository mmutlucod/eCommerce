import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

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
    { title: 'ÜRÜN', subItems: ['Marka Tanımla', 'Urunlerim', 'Kategori 3'] },
    { title: 'SİPARİŞ & KARGO', subItems: ['Sipariş Takibi', 'Kargo Seçenekleri'] },
    { title: 'FİNANS', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
    { title: 'PROMOSYONLAR', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
    { title: 'RAPORLAR', subItems: ['Fatura İşlemleri', 'Ödeme Seçenekleri'] },
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
  const handleSubItemClickProducts = (subItem) => {
    if (subItem === 'Urunlerim') {
      navigate('/seller/product');
    }
    handleMenuClose();
  };

  const handleSubItemClickBrands = (subItem) => {
    if (subItem === 'Marka Tanımla') {
      navigate('/seller/seller-add');
    }
    handleMenuClose();
  };

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
                <span className="menu-arrow">
                  {openMenuTitle === menuItem.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </span>
              </StyledMenuButton>
              <Menu
                PaperProps={{ sx: { bgcolor: 'secondary.main', color: 'common.white', boxShadow: 3 } }}
                id={`menu-${menuItem.title}`}
                anchorEl={anchorEls[menuItem.title]}
                keepMounted
                open={Boolean(anchorEls[menuItem.title])}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose }}
              >
                {menuItem.subItems.map((subItem) => (
                  <StyledMenuItem key={subItem} onClick={() => handleSubItemClickBrands(subItem)}>
                    {subItem}
                  </StyledMenuItem>
                ))}
              </Menu>
            </React.Fragment>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          {/* Simge butonları */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error"><MailIcon /></Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={17} color="error"><ShoppingCartIcon /></Badge>
          </IconButton>
          <IconButton edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
