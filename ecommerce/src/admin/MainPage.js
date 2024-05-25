import React, { useEffect, useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Grid, Card, CardContent, Paper, Toolbar, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
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
            backgroundColor: '#3a3a3a',
            color: '#fff',
            borderRadius: '0 30px 30px 0',
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
            { text: 'Yorum Onay', icon: <CategoryIcon />, link: '/admin/products' },
            { text: 'Soru Onay', icon: <CategoryIcon />, link: '/admin/products' },
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
            {/* İstatistik Kartları */}
            {['Satışlar', 'Ziyaretçiler', 'Siparişler', 'Gelir'].map((statistic) => (
              <Grid item xs={12} sm={6} md={3} key={statistic}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {statistic}
                    </Typography>
                    <Typography variant="body2">
                      Detaylar...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
           
           <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ bgcolor: '#1565c0', color: '#fff', p: 2 }}>
                <IconButton component={Link} to="/orders" sx={{ color: '#fff' }}>
                  <ShoppingCartIcon />
                </IconButton>
                Son 5 Sipariş
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sipariş ID</TableCell>
                      <TableCell>Tutar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.order_date}</TableCell>
                        <TableCell>{order.total_price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ bgcolor: '#1565c0', color: '#fff', p: 2 }}>
                <IconButton component={Link} to="/users" sx={{ color: '#fff' }}>
                  <GroupIcon />
                </IconButton>
                Son 5 Kullanıcı
              </Typography>
              <TableContainer component={Paper}>
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
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 2, textAlign: 'center', color: '##3a3a3a' }}>
  <Typography variant="body1">© 2024 Admin Panel. Tüm hakları saklıdır.</Typography>
  <Typography variant="body2">Bize ulaşın: admin@example.com</Typography>
</Paper>
      </Box>
    </Box>
  );
}


export default MainPage;
