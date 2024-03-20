import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';
import { green } from '@mui/material/colors';

import { Alert } from '@mui/material';

function Products() {
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ürünler çekilirken bir hata oluştu:', error);
      setLoading(false);
      handleSnackbarOpen('Ürünler yüklenirken bir hata oluştu.');
    }
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Uyarı mesajı yerine yükleme durumunu gösterebilirsiniz */}
            {loading ? (
              <Alert severity="info">Ürünler yükleniyor...</Alert>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ürün Listesi
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Ürün ID</b></TableCell>
                          <TableCell><b>Ürün Adı</b></TableCell>
                          <TableCell><b>Kategori</b></TableCell>
                          <TableCell><b>Onay Durumu</b></TableCell>
                          <TableCell><b>Aktiflik Durumu</b></TableCell>
                          <TableCell><b>Marka Adı</b></TableCell>
                          <TableCell><b>Fiyat</b></TableCell>
                          <TableCell><b>Güncelleme Tarihi</b></TableCell>
                          <TableCell><b>Stok Adedi</b></TableCell>
                          <TableCell align="right"><b>İşlemler</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {console.log(products)}
                        {products.map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell>{product.product_id}</TableCell>
                            <TableCell>{product.product.name}</TableCell>
                            <TableCell>{product.product.category}</TableCell>
                            <TableCell>{product.ApprovalStatus.status_name}</TableCell>
                            <TableCell>{product.is_active}</TableCell>
                            <TableCell>{product.product.Brand.brand_name}</TableCell>
                            <TableCell>{`$${product.price}`}</TableCell>
                            <TableCell>{product.updateAt}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Düzenle">
                                <IconButton>
                                  <EditIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          ContentProps={{
            sx: { backgroundColor: green[600] },
          }}
        />
      </Container>
    </>
  );
}

export default Products;
