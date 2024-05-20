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
import QuestionIcon from '@mui/icons-material/QuestionAnswer';


const menuItems = [
  { id: 'orders', label: 'Siparişlerim', icon: <ShoppingCartIcon />, link: "/siparislerim" },
  { id: 'profile', label: 'Kullanıcı Bilgileri', icon: <PersonOutlineIcon />, link: "/profilim" },
  { id: 'address-info', label: 'Adres Bilgilerim', icon: <HomeWorkIcon />, link: "/adreslerim" },
  { id: 'favorites', label: 'Favorilerim', icon: <StarBorderIcon />, link: "/favorilerim" },
  { id: 'card-preferences', label: 'Kayıtlı Kartlarım', icon: <CreditCardIcon />, link: "/kayitli-kartlarim" },
  { id: 'questions', label: 'Sorularım', icon: < QuestionIcon />, link: "/sorularim" },
  { id: 'reviews', label: 'Değerlendirmelerim', icon: <StarBorderIcon />, link: "/degerlendirmelerim" },
];

const renderMenuItems = (selectedItem, setSelectedItem) => {
  return menuItems.map(item => (
    <Link to={item.link} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItem onClick={() => setSelectedItem(item.id)} selected={selectedItem === item.id}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItem>
    </Link>
  ));
};


export { renderMenuItems };