import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SellerNavbar from '../components/SellerNavbar';
import { Link } from 'react-router-dom';
import api from '../api/api';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (event, sellerProductId) => {
    const updatedProducts = products.map(product => {
      if (product.seller_product_id === sellerProductId) {
        return { ...product, price: event.target.value };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleSubmit = async (event, sellerProductId) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const product = products.find(product => product.seller_product_id === sellerProductId);
      setUpdateLoading(true);
      try {
        await api.put(`/seller/products/${sellerProductId}`, {
          price: product.price
        });
        setSuccessMessage('Fiyat başarıyla güncellendi.');
        event.target.blur();
      } catch (error) {
        setErrorMessage('Fiyat güncellenirken bir hata oluştu.');
        console.error('Fiyat güncellenirken bir hata oluştu:', error);
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const handleClick = (event, sellerProductId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(sellerProductId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    const product = products.find(product => product.seller_product_id === selectedProductId);
    setEditProduct(product);
    setOpenEditModal(true);
    handleClose();
  };

  const handleListStatusChange = async (sellerProductId, shouldBeListed) => {
    setUpdateLoading(true);
    try {
      await api.put(`/seller/products/${sellerProductId}`, {
        is_active: shouldBeListed ? 1 : 0,
      });
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.seller_product_id === sellerProductId ? { ...product, is_active: shouldBeListed ? 1 : 0 } : product
        )
      );
      setSuccessMessage(shouldBeListed ? 'Ürün başarıyla listelendi.' : 'Ürün başarıyla listeden kaldırıldı.');
    } catch (error) {
      setErrorMessage('Ürün durumu güncellenirken bir hata oluştu.');
      console.error('Ürün durumu güncellenirken bir hata oluştu:', error);
    } finally {
      setUpdateLoading(false);
      handleClose();
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setEditProduct({ ...editProduct, [mainKey]: { ...editProduct[mainKey], [subKey]: value } });
    } else {
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  const handleEditSubmit = async () => {
    setUpdateLoading(true);
    try {
      await api.put(`/seller/products/${editProduct.seller_product_id}`, editProduct);
      fetchProducts();
      setSuccessMessage('Ürün başarıyla güncellendi.');
      setOpenEditModal(false);
    } catch (error) {
      setErrorMessage('Ürün güncellenirken bir hata oluştu.');
      console.error('Ürün güncellenirken bir hata oluştu:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="lg" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Ürün Listesi
          </Typography>
          <IconButton component={Link} to="/seller/urun-ekle" color="primary">
            <AddIcon />
          </IconButton>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={3} style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ürün Foto</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ürün Adı</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kategori</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Onay Durumu</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Aktiflik Durumu</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Marka Adı</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fiyat</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Güncelleme Tarihi</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok Adedi</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.seller_product_id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.seller_product_id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.category.category_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.ApprovalStatus.status_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.is_active ? 'Aktif' : 'Pasif'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.Brand.brand_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <TextField
                        size="small"
                        value={product.price}
                        onChange={(event) => handlePriceChange(event, product.seller_product_id)}
                        onKeyDown={(event) => handleSubmit(event, product.seller_product_id)}
                        type="text"
                        variant="standard"
                        InputProps={{
                          disableUnderline: false,
                          style: { textAlign: 'center' },
                        }}
                      />
                      {console.log(product)}
                    </td>
                    {console.log(product)}
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(product.updatedAt)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.stock}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <Tooltip title="Daha Fazla">
                        <IconButton onClick={(event) => handleClick(event, product.seller_product_id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleEdit}>Düzenle</MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleListStatusChange(
                              selectedProductId,
                              !products.find(product => product.seller_product_id === selectedProductId).is_active
                            )
                          }
                        >
                          {products.find(product => product.seller_product_id === selectedProductId)?.is_active ? 'Pasif Et' : 'Aktif Et'}
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        )}
      </Container>
      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={updateLoading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Ürünü Düzenle</DialogTitle>
        <DialogContent>
          {editProduct && (
            <form>
             
              <TextField
                fullWidth
                margin="normal"
                label="Fiyat"
                name="price"
                value={editProduct.price}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Stok Adedi"
                name="stock"
                value={editProduct.stock}
                onChange={handleEditChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Aktiflik Durumu</InputLabel>
                <Select
                  name="is_active"
                  value={editProduct.is_active}
                  onChange={handleEditChange}
                  native
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Pasif</option>
                </Select>
              </FormControl>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>İptal</Button>
          <Button onClick={handleEditSubmit} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Products;
