import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Collapse
} from '@mui/material';
import Navbar from '../components/UserNavbar';
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082', // Navbar ve butonlar için mor renk
    },
    secondary: {
      main: '#FFD700', // İkincil eylemler ve butonlar için sarı renk
    },
    background: {
      default: '#f4f4f4', // Sayfanın arka plan rengi
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Kart gölgelendirme
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold', // Buton yazı tipi kalınlığı
        },
      },
    },
  },
});

const OrdersPage = () => {
  const [selectedItem, setSelectedItem] = useState('orders'); // Başlangıç değeri olarak 'orders'
  const [orders, setOrders] = useState([]); // Sipariş listesi için state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({}); // Seçili siparişin detayları için state

  useEffect(() => {
    // API'den sipariş verilerini al
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/user/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Siparişler alınırken hata oluştu:', error);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await api.get(`/user/orderItems?orderId=${orderId}`);
      setSelectedOrderDetails((prevDetails) => ({
        ...prevDetails,
        [orderId]: response.data
      }));
    } catch (error) {
      console.error('Sipariş kalemleri alınırken hata oluştu:', error);
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (selectedOrderDetails[orderId]) {
      setSelectedOrderDetails((prevDetails) => ({
        ...prevDetails,
        [orderId]: null
      }));
    } else {
      fetchOrderItems(orderId);
    }
  };

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={3}>
              <Paper elevation={0} square>
                <List>{renderMenuItems(selectedItem, setSelectedItem)}</List>
              </Paper>
            </Grid>
            <Box flex={1} sx={{ maxWidth: '750px', mx: 4 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Siparişlerim
                </Typography>
                <Divider sx={{ my: 2 }} />
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Typography color="textSecondary">Sipariş Tarihi</Typography>
                            <Typography variant="body2">{order.order_date}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography color="textSecondary">Sipariş Özeti</Typography>
                            <Typography variant="body2">{order.summary}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Typography color="textSecondary">Durum</Typography>
                            <Typography variant="body2">{order.orderStatus.status_name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Typography color="textSecondary">Tutar</Typography>
                            <Typography variant="body2">{`${order.total_price} TL`}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary" onClick={() => toggleOrderDetails(order.id)}>
                          Sipariş Detayı
                        </Button>
                      </CardActions>
                      <Collapse in={!!selectedOrderDetails[order.id]} timeout="auto" unmountOnExit>
                        <CardContent>
                          {selectedOrderDetails[order.id] ? (
                            <List>
                              {selectedOrderDetails[order.id].map((item, idx) => (
                                <Box key={idx} sx={{ mb: 2 }}>
                                  <Typography variant="body2">{`Ürün Adı: ${item.product.name}`}</Typography>
                                  <Typography variant="body2">{`Adet: ${item.quantity}`}</Typography>
                                  <Typography variant="body2">{`Fiyat: ${item.price} TL`}</Typography>
                                  <Typography variant="body2">{`Toplam: ${item.total} TL`}</Typography>
                                </Box>
                              ))}
                            </List>
                          ) : (
                            <Typography>Kalemler yükleniyor...</Typography>
                          )}
                        </CardContent>
                      </Collapse>
                    </Card>
                  ))
                ) : (
                  <Typography>Siparişler yükleniyor...</Typography>
                )}
              </Paper>
            </Box>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default OrdersPage;
