import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Button, Snackbar, Alert, Menu, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminNavbar from '../components/AdminNavbar';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState({
    id: null,
    name: '',
    brand_id: '',
    price: '',
    ApprovalStatus: '', // approvalStatus için varsayılan bir değer olarak boş string
  });
  const [productToDelete, setProductToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Bu eksikti.
  const [approvalStatuses, setApprovalStatuses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
    fetchApprovalStatuses();
    fetchBrands();
    fetchCategories()
  }, []);
  const fetchBrands = async () => {
    try {
      const response = await api.get('/admin/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Fetching brands failed:', error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Fetching products failed:', error);
      setSnackbarMessage('Failed to fetch products.');
      setSnackbarOpen(true);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories'); // API yolunuzu kontrol edin
      setCategories(response.data);
    } catch (error) {
      console.error('Fetching categories failed:', error);
    }
  };
  const fetchApprovalStatuses = async () => {
    try {
      const response = await api.get('/admin/approvalstatuses');
      setApprovalStatuses(response.data);
    } catch (error) {
      console.error('Fetching approval statuses failed:', error);
    }
  };

  const handleDialogOpen = (product = null) => {
    setProductToEdit(product ? { ...product } : { id: null, name: '', brand: '', price: '', ApprovalStatus: '' });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleProductUpdate = async () => {
    // API URL'si
    const baseUrl = "/admin/products";

    // Eğer ürün ID'si varsa, bu bir güncelleme işlemidir.
    const isUpdateOperation = productToEdit.product_id != null;

    try {
      const response = isUpdateOperation
        ? await api.put(`${baseUrl}/${productToEdit.product_id}`, productToEdit) // Güncelleme işlemi
        : await api.post(baseUrl, productToEdit); // Ekleme işlemi

      // Başarılı işlem sonrası bildirim mesajı
      const successMessage = isUpdateOperation
        ? 'Ürün başarıyla güncellendi.'
        : 'Ürün başarıyla eklendi.';

      setSnackbarMessage(successMessage);
      setSnackbarOpen(true);

      // Ürün listesini yeniden fetch et
      fetchProducts();

      // Diyalog penceresini kapat
      setOpenDialog(false);
    } catch (error) {
      console.error('Ürün güncelleme/ekleme işlemi sırasında bir hata meydana geldi:', error);

      // Hata durumu için bildirim mesajı
      setSnackbarMessage('Ürün güncelleme/ekleme işlemi başarısız oldu.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDialogOpen = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleProductDelete = async () => {
    // Ürün silme işlemleri
  };

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setProductToDelete(product); // Menüyü açmak için gerekli olan ürünü ayarlayın.
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprovalStatusChange = (event) => {
    setProductToEdit({ ...productToEdit, approval_status_id: event.target.value });
  };

  const handleBrandChange = (event) => {
    setProductToEdit({ ...productToEdit, brand_id: event.target.value });
  };

  const handleAddMenuClick = () => {
    navigate('/admin/productadd');
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h5" gutterBottom>Ürün Listesi</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      aria-label="Menü Ekle"
                      onClick={handleAddMenuClick}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ürün Adı</TableCell>
                        <TableCell align="right">Stok Kodu</TableCell>
                        <TableCell align="right">Kategori</TableCell>
                        <TableCell align="right">Marka</TableCell>
                        <TableCell align="right">Fiyat</TableCell>
                        <TableCell align="right">Onay Durumu</TableCell>
                        <TableCell align="right">Onaylayan Kişi</TableCell>
                        <TableCell align="right" style={{ textAlign: "right", paddingRight: 0 }}>İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.product_id}>
                          <TableCell component="th" scope="row">{product.name}</TableCell>
                          <TableCell align="right">{product.stock_code}</TableCell>
                          <TableCell align="right">{product.category?.category_name || 'Bilinmiyor'}</TableCell>
                          <TableCell align="right">{product.Brand?.brand_name || 'Bilinmiyor'}</TableCell>
                          <TableCell align="right">{product.price}</TableCell>
                          <TableCell align="right">{product.ApprovalStatus?.status_name || 'Bilinmiyor'}</TableCell>
                          <TableCell align="right">{product.Admin?.full_name || 'Bilinmiyor'}</TableCell>
                          <TableCell align="right">{product.approver}</TableCell>
                          <TableCell>
                            <IconButton aria-label="settings" onClick={(event) => handleMenuClick(event, product)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleDialogOpen(productToDelete); handleMenuClose(); }}>Düzenle</MenuItem>
        <MenuItem onClick={() => { handleDeleteDialogOpen(productToDelete); handleMenuClose(); }}>Sil</MenuItem>
      </Menu>

      {/* Diyaloglar, Snackbar ve diğer UI bileşenleri... */}
      <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{productToEdit.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ürün Adı"
            type="text"
            fullWidth
            value={productToEdit.name}
            onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Kategori</InputLabel>
            <Select
              label="Kategori"
              value={productToEdit.category_id || ''} // Kategorinin ID'sini tutacak bir alanınız varsa
              onChange={(e) => setProductToEdit({ ...productToEdit, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category_name} 
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Marka</InputLabel>
            <Select
              label="Marka"
              value={productToEdit.brand_id || ''}
              onChange={handleBrandChange}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            id="price"
            label="Fiyat"
            type="number"
            fullWidth
            value={productToEdit.price}
            onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
          />
          {/* Select Component for Approval Status */}
          {productToEdit && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Onay Durumu</InputLabel>
              <Select
                label="Onay Durumu"
                name="approval_status_id"
                value={productToEdit.approval_status_id}
                onChange={handleApprovalStatusChange}
              >
                {approvalStatuses.map((status) => (
                  <MenuItem key={status.approval_status_id} value={status.approval_status_id}>
                    {status.status_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">İptal</Button>
          <Button onClick={handleProductUpdate} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ürünü silmek istediğinize emin misiniz?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleProductDelete} color="primary" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Bildirimi */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductsAdmin;
