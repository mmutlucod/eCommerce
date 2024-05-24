import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import QuestionIcon from '@mui/icons-material/QuestionAnswer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

const menuItems = [
  { id: 'orders', label: 'Siparişlerim', icon: <ShoppingCartIcon />, link: "/siparislerim" },
  { id: 'profile', label: 'Kullanıcı Bilgilerim', icon: <PersonIcon />, link: "/profilim" },
  { id: 'addresses', label: 'Adres Bilgilerim', icon: <HomeWorkIcon />, link: "/adreslerim" },
  { id: 'favorites', label: 'Favorilerim', icon: <FavoriteIcon />, link: "/favorilerim" },
  { id: 'questions', label: 'Sorularım', icon: < QuestionIcon />, link: "/sorularim" },
  { id: 'reviews', label: 'Değerlendirmelerim', icon: <CommentIcon />, link: "/degerlendirmelerim" },
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