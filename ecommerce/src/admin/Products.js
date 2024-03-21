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
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setProductToEdit(product);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleProductUpdate = async () => {
    // Ürünü güncellemek için API çağrısı
    if (productToEdit) {
      try {
        await api.put(`/admin/products/${productToEdit.id}`, { name: productToEdit.name });
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
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ürün Adı</TableCell>
                        <TableCell align="right">Fiyat</TableCell>
                        <TableCell align="right">Stok</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {console.log(products)}
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell component="th" scope="row">
                            {product.name}
                          </TableCell>
                          <TableCell align="right">{product.price}</TableCell>
                          <TableCell align="right">{product.stock}</TableCell>
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
        <DialogTitle>{productToEdit ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ürün Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={productToEdit ? productToEdit.name : ''}
            onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
          />
          {/* Daha fazla TextField bileşeni ekleyerek diğer ürün özelliklerini düzenleyebilirsiniz */}
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
