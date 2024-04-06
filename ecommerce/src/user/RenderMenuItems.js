import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// Menü öğelerinin tanımı
const menuItems = [
  { id: 'orders', label: 'Siparişlerim', icon: <ShoppingCartIcon />, link: "/user/orders" },
  { id: 'profile', label: 'Kullanıcı Bilgileri', icon: <PersonOutlineIcon />, link: "/user/profile" },
  { id: 'coupons', label: 'İndirim Kuponlarım', icon: <CardGiftcardIcon />, link: "/user/coupons" },
  { id: 'reviews', label: 'Değerlendirmelerim', icon: <StarBorderIcon />, link: "/user/reviews" },
  { id: 'address-info', label: 'Adres Bilgilerim', icon: <HomeWorkIcon />, link: "/user/address-info" },
  { id: 'card-preferences', label: 'Kayıtlı Kartlarım', icon: <CreditCardIcon />, link: "/user/card-preferences" }
];


// selectedItem ve setSelectedItem argümanlarını kabul edecek şekilde fonksiyonu güncelleyin
const renderMenuItems = (selectedItem, setSelectedItem) => {
    return menuItems.map(item => (
      <Link to={item.link} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItem button onClick={() => setSelectedItem(item.id)} selected={selectedItem === item.id}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      </Link>
    ));
  };
  

  export { renderMenuItems };