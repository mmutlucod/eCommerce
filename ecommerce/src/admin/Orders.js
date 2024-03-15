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
  IconButton,
  Collapse,
  Box,
  CircularProgress
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../api/api'; // API iletişimi için axios instance'ınızın yolu
import AdminNavbar from '../components/AdminNavbar'; 
function Orders() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState({});

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

  const handleToggle = async (id) => {
    const isOpen = !open[id];
    setOpen(prevOpen => ({ ...prevOpen, [id]: isOpen }));

    if (isOpen && !orderDetails[id]) {
      setLoading(prevLoading => ({ ...prevLoading, [id]: true }));
      try {
        const response = await api.get(`/admin/orders/${id}`);
        setOrderDetails(prevDetails => ({ ...prevDetails, [id]: response.data }));
      } catch (error) {
        console.error('Sipariş detayları çekilirken bir hata oluştu:', error);
      } finally {
        setLoading(prevLoading => ({ ...prevLoading, [id]: false }));
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  }

  return (
    <div> <AdminNavbar />
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        
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
              <TableCell align="right">Aksiyon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.order_id}>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.user.name + " " + order.user.surname}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleToggle(order.order_id)}
                      style={{ color: 'blue' }}
                    >
                      {open[order.order_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open[order.order_id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        {loading[order.order_id] ? (
                          <CircularProgress />
                        ) : (
                          orderDetails[order.order_id] && (
                            <React.Fragment>
                                {console.log(orderDetails[order.order_id])}
                              <Typography variant="h6">Sipariş Detayı:</Typography>
                              {orderDetails[order.order_id].OrderItems.map((item, index) => (
                                <Box key={index} sx={{ marginBottom: 2 }}>
                                  <Typography>Ürün ID: {item.product_id}</Typography>
                                  <Typography>Miktar: {item.quantity}</Typography>
                                  <Typography>Fiyat: {item.price}</Typography>
                                  {/* Diğer gerekli bilgiler */}
                                </Box>
                              ))}
                            </React.Fragment>
                          )
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </div>
  );
}

export default Orders;
