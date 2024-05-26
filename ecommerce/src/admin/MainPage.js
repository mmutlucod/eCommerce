import React, { useEffect, useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Grid, Card, CardContent, Paper, Toolbar, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import CommentIcon from '@mui/icons-material/Comment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../api/api'; // Yolu doğru belirleyin

const drawerWidth = 240;

function MainPage() {
  const [latestOrders, setLatestOrders] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const ordersResponse = await api.get('admin/orders');
        setLatestOrders(ordersResponse.data.slice(0, 5));
        const usersResponse = await api.get('admin/users');
        setLatestUsers(usersResponse.data.slice(0, 5));
      } catch (error) {
        console.error("Veri çekme işlemi sırasında bir hata oluştu:", error);
      }
    };

    fetchLatestData();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ml: 20,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '75px',
            height: 'calc(100% - 150px)',
            backgroundColor: '#6d6d6d', // Gri renk
            color: '#fff',
            borderRadius: '0 15px 15px 0', // Border radius azaltıldı
          },
        }}
      >
        <List>
          {[{ text: 'Ana Sayfa', icon: <DashboardIcon />, link: '/admin/dashboard' },
          { text: 'Kullanıcılar', icon: <GroupIcon />, link: '/admin/users' },
          { text: 'Siparişler', icon: <ShoppingCartIcon />, link: '/admin/orders' },
          { text: 'Markalar', icon: <BrandingWatermarkIcon />, link: '/admin/brands' },
          { text: 'Satıcılar', icon: <AccountCircleIcon />, link: '/admin/sellers' },
          { text: 'Kategoriler', icon: <CategoryIcon />, link: '/admin/categories' },
          { text: 'Ürünler', icon: <CategoryIcon />, link: '/admin/products' },
          { text: 'Yorum Onay', icon: <CommentIcon />, link: '/admin/review-approval' },
          { text: 'Soru Onay', icon: <QuestionAnswerIcon />, link: '/admin/question-approval' },
          { text: 'Ürün Onay', icon: <CheckCircleIcon />, link: '/admin/product-approval' },
          { text: 'Satıcı Onay', icon: <CheckCircleIcon />, link: '/admin/seller-approval' },
          ].map((item, index) => (
            <ListItem button key={item.text} component={Link} to={item.link} sx={{ '&:hover': { backgroundColor: '#1565c0' } }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container sx={{ py: 2 }}>
          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ bgcolor: '#f5f5dc', color: '#3a3a3a', p: 2, borderRadius: '8px' }}>
                <IconButton component={Link} to="/orders" sx={{ color: '#3a3a3a' }}>
                  <ShoppingCartIcon />
                </IconButton>
                Son 5 Sipariş
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: '8px', backgroundColor: '#f5f5dc' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sipariş Tarihi</TableCell>
                      <TableCell>Tutar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(order.order_date).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                        <TableCell>{order.total_price} ₺</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ bgcolor: '#f5f5dc', color: '#3a3a3a', p: 2, borderRadius: '8px' }}>
                <IconButton component={Link} to="/users" sx={{ color: '#3a3a3a' }}>
                  <GroupIcon />
                </IconButton>
                Son 5 Kullanıcı
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: '8px', backgroundColor: '#f5f5dc' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kullanıcı Adı</TableCell>
                      <TableCell>E-posta</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.name === null ? ('Yeni Kullanıcı') : (user.name + ' ' + user.surname)} </TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 2, textAlign: 'center', backgroundColor: '#3a3a3a', color: '#fff' }}>
          <Typography variant="body1">© 2024 Admin Panel. Tüm hakları saklıdır.</Typography>
          <Typography variant="body2">Bize ulaşın: admin@example.com</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default MainPage;
