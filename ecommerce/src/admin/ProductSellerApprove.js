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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('admin/getSellerProducts');
      const sortedProducts = response.data.sort((a, b) => b.approval_status_id === 3 ? 1 : -1); // Onay bekleyen ürünler üste
      setProducts(sortedProducts);
      setApprovedProducts(response.data.filter(product => product.approval_status_id === 1));
      setRejectedProducts(response.data.filter(product => product.approval_status_id === 2));
    } catch (error) {
      console.error("Ürünleri çekerken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

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
      await api.put(`admin/approve/seller-product/${selectedProductId}/1`); // Onay için endpointi kullanın
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
      await api.put(`admin/approve/seller-product/${selectedProductId}/2`); // Reddetmek için endpointi kullanın
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h4" gutterBottom>Satıcı Ürün Onaylama</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ürün ID</TableCell>
                          <TableCell>Ürün Adı</TableCell>
                          <TableCell>Ürün Fiyatı</TableCell>
                          <TableCell>Satıcı Kullanıcı Adı</TableCell>
                          <TableCell>Satıcı Mail</TableCell>
                          <TableCell>Numarası</TableCell>
                          <TableCell>Durumu</TableCell>
                          <TableCell>İşlemler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.filter(product => product.approval_status_id === 3).map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell>{product.product_id}</TableCell>
                            <TableCell>{product.product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.seller ? `${product.seller.username} ` : 'Bilinmiyor'}</TableCell>
                            <TableCell>{product.seller ? product.seller.email : 'Bilinmiyor'}</TableCell>
                            <TableCell>{product.seller.phone}</TableCell>
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
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">Onaylanan Ürünler</Typography>
                  {approvedProducts.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ürün ID</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Ürün Fiyatı</TableCell>
                            <TableCell>Satıcı Kullanıcı Adı</TableCell>
                            <TableCell>Satıcı Mail</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approvedProducts.map((product) => (
                            <TableRow key={product.product_id}>
                              <TableCell>{product.product_id}</TableCell>
                              <TableCell>{product.product.name}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.seller ? `${product.seller.username} ` : 'Bilinmiyor'}</TableCell>
                              <TableCell>{product.seller ? product.seller.email : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz onaylanan bir ürün yok.</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Reddedilen Ürünler</Typography>
                  {rejectedProducts.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ürün ID</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Ürün Fiyatı</TableCell>
                            <TableCell>Satıcı Kullanıcı Adı</TableCell>
                            <TableCell>Satıcı Mail</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rejectedProducts.map((product) => (
                            <TableRow key={product.product_id}>
                              <TableCell>{product.product_id}</TableCell>
                              <TableCell>{product.product.name}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.seller ? `${product.seller.username} ` : 'Bilinmiyor'}</TableCell>
                              <TableCell>{product.seller ? product.seller.email : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz reddedilen bir ürün yok.</Typography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={actionLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default ProductSellerApprove;
