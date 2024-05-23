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
  Box
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
                    <TableCell>Kalan Adet</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.sellerProduct.product.name}</TableCell>
                      <TableCell>{order.sellerProduct.product.Brand.brand_name}</TableCell>
                      <TableCell>{order.sellerProduct.price}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.remaining_quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Orders;
