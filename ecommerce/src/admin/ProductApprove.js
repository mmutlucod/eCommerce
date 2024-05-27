import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Snackbar, Alert, CircularProgress, Backdrop
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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      const productsData = response.data;
      setProducts(productsData.filter(product => product.approval_status_id === 3));
      setApprovedProducts(productsData.filter(product => product.approval_status_id === 1));
      setRejectedProducts(productsData.filter(product => product.approval_status_id === 2));
    } catch (error) {
      console.error("Ürünleri çekerken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setActionLoading(true);
    try {
      await api.put(`admin/approve/product/${selectedProductId}/1`); // Onay için endpointi kullanın
      setSnackbarMessage('Ürün başarıyla onaylandı.');
      setSnackbarSeverity('success');
      await fetchProducts(); // Ürünleri tekrar çek
    } catch (error) {
      console.error("Ürünü onaylarken hata oluştu:", error);
      setSnackbarMessage('Ürünü onaylarken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setActionLoading(false);
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.put(`admin/approve/product/${selectedProductId}/2`); // Reddetmek için endpointi kullanın
      setSnackbarMessage('Ürün başarıyla reddedildi.');
      setSnackbarSeverity('success');
      await fetchProducts(); // Ürünleri tekrar çek
    } catch (error) {
      console.error("Ürünü reddederken hata oluştu:", error);
      setSnackbarMessage('Ürünü reddederken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setActionLoading(false);
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderProductTable = (title, products) => (
    <Grid item xs={12}>
      <Typography variant="h6">{title}</Typography>
      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ürün ID</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Marka Adı</TableCell>
                <TableCell>Kategori Adı</TableCell>
                <TableCell>Satıcı</TableCell>
                <TableCell>Fiyat</TableCell>
                <TableCell>Durumu</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  {console.log(product)}
                  <TableCell>{product.name || "Bilinmiyor"}</TableCell>
                  <TableCell>{product.Brand?.brand_name || "Bilinmiyor"}</TableCell>
                  <TableCell>{product.category?.category_name || "Bilinmiyor"}</TableCell>
                  <TableCell>{product.seller ? product.seller.name : 'Bilinmiyor'}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.ApprovalStatus.status_name}</TableCell>
                  <TableCell>
                    {title === 'Onay Bekleyen Ürünler' && (
                      <IconButton onClick={(event) => handleMenuOpen(event, product.product_id)}>
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{ '& .MuiPaper-root': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } }}
                    >
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
      ) : (
        <Typography>Henüz {title.toLowerCase()} bir ürün yok.</Typography>
      )}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h4" gutterBottom>Ürün Onaylama</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {renderProductTable('Onay Bekleyen Ürünler', products)}
              {renderProductTable('Onaylanan Ürünler', approvedProducts)}
              {renderProductTable('Reddedilen Ürünler', rejectedProducts)}
            </Grid>
          )}
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={actionLoading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default ProductSellerApprove;
