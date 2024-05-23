import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingCode, setShippingCode] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('seller/seller-orders');
        setOrders(response.data);
      } catch (error) {
        setErrorMessage('Siparişler yüklenirken bir hata oluştu.');
        console.error('Siparişler yüklenirken bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOrder(null);
    setShippingCode('');
  };

  const handleShippingCodeChange = (e) => {
    setShippingCode(e.target.value);
  };

  const handleSaveShippingCode = async () => {
    try {
      await api.post(`seller/update-shipping-code/${selectedOrder.order_id}`, { shippingCode });
      setOrders((prevOrders) => prevOrders.map((order) => 
        order.order_id === selectedOrder.order_id ? { ...order, shipping_code: shippingCode } : order
      ));
      handleCloseDialog();
    } catch (error) {
      setErrorMessage('Kargo kodu güncellenirken birhata oluştu.');
      console.error('Kargo kodu güncellenirken bir hata oluştu:', error);
      }
      };
      
      return (
      <>
      <SellerNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px', marginBottom: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
      Siparişler
      </Typography>
      {loading ? (
      <Box display="flex" justifyContent="center" marginTop="20px">
      <CircularProgress />
      </Box>
      ) : (
      <TableContainer component={Paper}>
      <Table>
      <TableHead>
      <TableRow>
      <TableCell>Sipariş ID</TableCell>
      <TableCell>Ürün Adı</TableCell>
      <TableCell>Marka</TableCell>
      <TableCell>Fiyat</TableCell>
      <TableCell>Adet</TableCell>
      <TableCell>Sipariş Durumu</TableCell>
      <TableCell>Kargo Kodu</TableCell>
      <TableCell>İşlemler</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {orders.map((order) => (
      <TableRow key={order.order_id}>
      <TableCell>{order.order_order_id}</TableCell>
      <TableCell>{order.sellerProduct.product.name}</TableCell>
      {console.log(order)}
      <TableCell>{order.sellerProduct.product.Brand.brand_name}</TableCell>
      <TableCell>{order.sellerProduct.price}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>{order.orderStatus ? order.orderStatus.status_name : 'Durum Bilinmiyor'}</TableCell>
      <TableCell>{order.shipping_code ? order.shipping_code : 'Kargo kodu yok'}</TableCell>
      <TableCell>
      <IconButton
      aria-label="shipping"
      onClick={() => handleOpenDialog(order)}
      >
      <LocalShippingIcon />
      </IconButton>
      </TableCell>
      </TableRow>
      ))}
      </TableBody>
      </Table>
      </TableContainer>
      )}
      </Paper>
      </Container>
      <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Kargo Kodu Ekle</DialogTitle>
      <DialogContent>
      <DialogContentText>
      Sipariş için kargo kodunu giriniz:
      </DialogContentText>
      <TextField
               autoFocus
               margin="dense"
               label="Kargo Kodu"
               fullWidth
               value={shippingCode}
               onChange={handleShippingCodeChange}
             />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleCloseDialog} color="primary">
      İptal
      </Button>
      <Button onClick={handleSaveShippingCode} color="primary">
      Kaydet
      </Button>
      </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
      <Alert onClose={handleCloseSnackbar} severity="error">
      {errorMessage}
      </Alert>
      </Snackbar>
      </>
      );
      };
      
      export default Orders;
