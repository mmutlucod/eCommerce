import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../api/api'; // Yolu doğru belirleyin

function ProductSellerApprove() {
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/admin/products');
        const sortedProducts = response.data.sort((a, b) => b.approval_status_id === 3 ? 1 : -1); // Onay bekleyen ürünler üste
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Ürünleri çekerken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleMenuOpen = (event, productId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = async () => {
    try {
      await api.put(`admin/approve/product/${selectedProductId}/1`); // Onay için endpointi kullanın
      setProducts(products.filter(product => product.product_id !== selectedProductId));
      setSnackbarMessage('Ürün başarıyla onaylandı.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error("Ürünü onaylarken hata oluştu:", error);
      setSnackbarMessage('Ürünü onaylarken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`admin/approve/product/${selectedProductId}/2`); // Reddetmek için endpointi kullanın
      setProducts(products.filter(product => product.product_id !== selectedProductId));
      setSnackbarMessage('Ürün başarıyla reddedildi.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error("Ürünü reddederken hata oluştu:", error);
      setSnackbarMessage('Ürünü reddederken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h4" gutterBottom>Ürün Onaylama</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ürün ID</TableCell>
                      <TableCell>Ürün Adı</TableCell>
                      <TableCell>Satıcı</TableCell>
                      <TableCell>Fiyat</TableCell>
                      <TableCell>Durumu</TableCell>
                      <TableCell>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.product_id}>
                        {console.log(product)}
                        <TableCell>{product.product_id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.seller ? product.seller.name : 'Bilinmiyor'}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.ApprovalStatus.status_name}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, product.product_id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleApprove}>
                              <CheckCircleIcon fontSize="small" /> Onayla
                            </MenuItem>
                            <MenuItem onClick={handleReject}>
                              <CancelIcon fontSize="small" /> Reddet
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductSellerApprove;
