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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminNavbar from '../components/AdminNavbar';
import api from '../api/api'; // API iletişim için kullanılacak

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productToEdit, setProductToEdit] = useState({
    id: null,
    name: '',
    brand: '',
    price: '',
    approvalStatus: ''
  });
  

  // Ürünleri çekmek için API çağrısı
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler çekilirken hata oluştu:', error);
      setSnackbarMessage('Ürünler çekilemedi.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditDialogOpen = (product) => {
    setProductToEdit({
      id: product.id,
      name: product.name,
      brand: product.Brand?.brand_name || '',
      price: product.price,
      approvalStatus: product.Approvalstatus?.status_name || ''
    });
    setOpenDialog(true);
  };

  const handleProductUpdate = async () => {
    // Ürünü güncellemek için API çağrısı
    if (productToEdit && productToEdit.id) {
      try {
        await api.put(`/admin/edit-product/${productToEdit.id}`, productToEdit);
        setSnackbarMessage('Ürün başarıyla güncellendi.');
        setSnackbarOpen(true);
        fetchProducts(); // Ürün listesini güncellemek için ürünleri yeniden çek
      } catch (error) {
        console.error('Ürün güncellenirken hata oluştu:', error);
        setSnackbarMessage('Ürün güncellenemedi.');
        setSnackbarOpen(true);
      }
    }
    handleDialogClose();
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Ürün Listesi
                </Typography>
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
  <Table>
    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
      <TableRow>
        <TableCell>Ürün Adı</TableCell>
        <TableCell align="right">Stok Kodu</TableCell>
        <TableCell align="right">Kategori</TableCell>
        <TableCell align="right">Marka</TableCell>
        <TableCell align="right">Katalog Fiyatı</TableCell>
        <TableCell align="right">Onay Durumu</TableCell>
        <TableCell align="right">Onaylayan Kişi</TableCell>
        <TableCell align="right">İşlemler</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {products.map((product, index) => (
        <TableRow key={product.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}> 
                          <TableCell component="th" scope="row">
                            {product.name}
                          </TableCell>
                          <TableCell align="right">{product.stock_code}</TableCell>
                          <TableCell align="right">{product.category}</TableCell>
                          <TableCell align="right">{product.Brand?.brand_name}</TableCell>
                          <TableCell align="right">{product.price}</TableCell>
                          <TableCell align="right">{product.Approvalstatus?.status_name}</TableCell>
                          <TableCell align="right">{product.Admin.full_name}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Düzenle">
                              <IconButton onClick={() => handleEditDialogOpen(product)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Tooltip title="Yeni Ürün Ekle">
                  <IconButton color="primary" onClick={() => handleEditDialogOpen(null)}>
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
  
      {/* Ürün Düzenleme Diyalogu */}
     <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle>{productToEdit.id ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Ürün Adı"
          type="text"
          fullWidth
          variant="outlined"
          value={productToEdit.name}
          onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
        />
        <TextField
          margin="dense"
          id="brand"
          label="Marka Adı"
          type="text"
          fullWidth
          variant="outlined"
          value={productToEdit.brand}
          onChange={(e) => setProductToEdit({ ...productToEdit, brand: e.target.value })}
        />
        <TextField
          margin="dense"
          id="price"
          label="Katalog Fiyatı"
          type="number"
          fullWidth
          variant="outlined"
          value={productToEdit.price}
          onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
        />
        <TextField
          margin="dense"
          id="approvalStatus"
          label="Onay Durumu"
          type="text"
          fullWidth
          variant="outlined"
          value={productToEdit.approvalStatus}
          onChange={(e) => setProductToEdit({ ...productToEdit, approvalStatus: e.target.value })}
        />
        {/* Diğer alanlarınızı buraya ekleyin */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>İptal</Button>
        <Button onClick={handleProductUpdate}>Güncelle</Button>
      </DialogActions>
    </Dialog>
      {/* Snackbar Bildirimi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
                      }  

export default ProductsAdmin;
