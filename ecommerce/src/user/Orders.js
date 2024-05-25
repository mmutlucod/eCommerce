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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import Navbar from '../components/UserNavbar';
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api';
import '../styles/OrderPage.css'; // Eklenen CSS dosyası

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
  const [selectedItem, setSelectedItem] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedOrderAddress, setSelectedOrderAddress] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/user/orders');
      const sortedOrders = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Siparişler alınırken hata oluştu:', error);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      setLoadingDetails(true);
      const [itemsResponse, addressResponse] = await Promise.all([
        api.get(`/user/orderItems/${orderId}`),
        api.get(`/user/order/${orderId}`)
      ]);
      setSelectedOrderDetails(itemsResponse.data);
      console.log(`Adresler: ${JSON.stringify(addressResponse.data.Address)}`);
      setSelectedOrderAddress(addressResponse.data.Address); // Address key'ini doğru şekilde alın
      setLoadingDetails(false);
    } catch (error) {
      console.error('Sipariş kalemleri alınırken hata oluştu:', error);
      setLoadingDetails(false);
    }
  };

  const handleOpenModal = (orderId) => {
    fetchOrderItems(orderId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedOrderDetails(null);
    setSelectedOrderAddress(null);
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => total + item.sellerProduct.price * item.quantity, 0);
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
                            <Typography variant="body2">{new Date(order.order_date).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            {/* <Typography color="textSecondary">Sipariş Özeti</Typography>
                            <Typography variant="body2">{order.summary}</Typography> */}
                            {/* <Typography variant="body2" color="primary">{`Satıcı: ${order.seller ? order.seller.name : 'Bilinmiyor'}`}</Typography> */}
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Typography color="textSecondary">Durum</Typography>
                            <Typography variant="body2">{order.orderStatus.status_name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            {console.log(order)}
                            <Typography color="textSecondary">Tutar</Typography>
                            <Typography variant="body2">{`${order.total_price} TL`}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary" onClick={() => handleOpenModal(order.order_id)}>
                          Sipariş Detayı
                        </Button>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <Typography>Siparişiniz bulunamadı</Typography>
                )}
              </Paper>
            </Box>
          </Grid>
        </Container>
        <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>Sipariş Detayları</DialogTitle>
          <DialogContent>
            {loadingDetails ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100px' }}>
                <CircularProgress />
              </Box>
            ) : selectedOrderDetails && selectedOrderDetails.orderItems.length > 0 ? (
              <Box>
                <div className="cart-header00">
                  <div className="cart-title0">
                    Sipariş ({selectedOrderDetails.orderItems.length} Ürün)
                  </div>
                </div>
                <div className="cart-items0">
                  {selectedOrderDetails.orderItems.map((item, idx) => (
                    <Box key={idx} className="cart-itemX0">
                      <Box className="item-image0">
                        {console.log(item.sellerProduct.product.productImages)}
                        <img src={item.sellerProduct.product.productImages && item.sellerProduct.product.productImages.length > 0 ? `http://localhost:5000/img/${item.sellerProduct.product.productImages[0].image_path}` : 'http://localhost:5000/img/empty.jpg'} alt={item.sellerProduct.product.name} />
                      </Box>
                      <Box className="item-details00">
                        {console.log(item)}
                        <Typography className="item-name0">{item.sellerProduct.product.name ? item.sellerProduct.product.name : 'Bilinmiyor'}</Typography>
                        <Box className="item-options0">
                          <Typography className="item-price0">Fiyat: {item.sellerProduct.price} ₺</Typography>
                          <Typography className="item-quantity0">Adet: {item.quantity}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Box sx={{ flex: 1, mr: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                    <Typography variant="h6">Teslimat Adresi</Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                      <Typography>{selectedOrderAddress.address_line}</Typography>
                      <Typography>, {selectedOrderAddress.street}</Typography>
                      <Typography>, {selectedOrderAddress.city}</Typography>
                      <Typography>, {selectedOrderAddress.state}</Typography>
                      <Typography>, {selectedOrderAddress.postal_code}</Typography>
                      <Typography>, {selectedOrderAddress.country}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, ml: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                    <Typography variant="h6">Fatura Adresi</Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                      <Typography>{selectedOrderAddress.address_line}</Typography>
                      <Typography>, {selectedOrderAddress.street}</Typography>
                      <Typography>, {selectedOrderAddress.city}</Typography>
                      <Typography>, {selectedOrderAddress.state}</Typography>
                      <Typography>, {selectedOrderAddress.postal_code}</Typography>
                      <Typography>, {selectedOrderAddress.country}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography>Sipariş detayları bulunamadı</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default OrdersPage;
