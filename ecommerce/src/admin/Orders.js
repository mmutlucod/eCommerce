import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import api from '../api/api'; // API iletişimi için axios instance'ınızın yolu

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Siparişler çekilirken bir hata oluştu:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Siparişler
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Müşteri Adı</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Toplam</TableCell>
              <TableCell>Detaylar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(order)}>
                    Görüntüle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedOrder && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Sipariş Detayları</DialogTitle>
          <DialogContent>
            {/* Sipariş detaylarını burada göster */}
            <Typography>ID: {selectedOrder.id}</Typography>
            <Typography>Müşteri Adı: {selectedOrder.customerName}</Typography>
            <Typography>Tarih: {selectedOrder.date}</Typography>
            <Typography>Toplam: {selectedOrder.total}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Kapat</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default Orders;
