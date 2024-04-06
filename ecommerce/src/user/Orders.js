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
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/UserNavbar';
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api';

const OrdersPage = () => {
  const [selectedItem, setSelectedItem] = useState('orders'); // Başlangıç değeri olarak 'orders'
  const [orders, setOrders] = useState([]); // Sipariş listesi için state

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

  return (
    <>
      <Navbar />
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
                        <Typography variant="body2">{order.date}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Typography color="textSecondary">Sipariş Özeti</Typography>
                        <Typography variant="body2">{order.summary}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography color="textSecondary">Alıcı</Typography>
                        <Typography variant="body2">{order.customerName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography color="textSecondary">Tutar</Typography>
                        <Typography variant="body2">{`${order.total_price} TL`}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Sipariş Detayı
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>Siparişler yükleniyor...</Typography>
            )}
          </Paper>
        </Box>
        </Grid>
      </Container>
    </>
  );
};

export default OrdersPage;
