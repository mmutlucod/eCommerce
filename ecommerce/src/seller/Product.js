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
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Menü ikonu için
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (event, productId) => {
    const updatedProducts = products.map(product => {
      if (product.product_id === productId) {
        return { ...product, price: event.target.value };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleSubmit = async (event, productId) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Formun yeniden yüklenmesini önle
      const product = products.find(product => product.product_id === productId);
      try {
        await api.put(`/seller/products/${productId}`, {
          price: product.price
        });
        // Başarılı güncelleme mesajı eklenebilir
      } catch (error) {
        console.error('Fiyat güncellenirken bir hata oluştu:', error);
        // Hata mesajı eklenebilir
      }
    }
  };

  // Menü açma işlevi
  const handleClick = (event, productId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  // Menü kapama işlevi
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Düzenleme ve silme işlevleri burada tanımlanabilir
  const handleEdit = () => {
    console.log("Düzenle", selectedProductId);
    handleClose();
  };

  const handleListStatusChange = async (productId, shouldBeListed) => {
    try {
      // API endpoint'inize uygun olarak düzenleyin
      const response = await api.put(`/seller/activateProduct/${productId}`, {
        is_active: shouldBeListed ? 1 : 0,
      });
      console.log(response.data);
      fetchProducts(); // Ürün listesini güncelle
    } catch (error) {
      console.error('Ürün durumu güncellenirken bir hata oluştu:', error);
    }
    handleClose(); // Menüyü kapat
  };
  
  const handleListStatusChange1 = async (productId, shouldBeListed) => {
    try {
      // API endpoint'inize uygun olarak düzenleyin
      const response = await api.put(`/seller/deactivateProduct/${productId}`, {
        is_active: shouldBeListed ? 1 : 0,
      });
      console.log(response.data);
      fetchProducts(); // Ürün listesini güncelle
    } catch (error) {
      console.error('Ürün durumu güncellenirken bir hata oluştu:', error);
    }
    handleClose(); // Menüyü kapat
  };
  
  
  return (
    <>
      <SellerNavbar />
      <Container maxWidth="lg" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Ürün Listesi
        </Typography>
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
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Marka Adi</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fiyat</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Guncelleme Tarihi</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok aded</th>
              </tr>
            </thead>
            <tbody>
              {console.log(products)}
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.category.category_name}</td>
                 
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.ApprovalStatus.status_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.is_active}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product.Brand.brand_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <TextField
                        size="small"
                        value={product.price}
                        onChange={(event) => handlePriceChange(event, product.product_id)}
                        onKeyDown={(event) => handleSubmit(event, product.product_id)}
                        type="text"
                        variant="standard"
                        
                        InputProps={{
                          disableUnderline: false,
                          style: { textAlign: 'center' },
                        }}
                        sx={{ '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' } }}
                      />
                    </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.updatedAt}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.stock}</td>
                  <tr key={product.product_id}>
                    {/* Ürün detayları ve düzenle/sil menüsü */}
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
    <IconButton
      aria-label="more"
      aria-controls="long-menu"
      aria-haspopup="true"
      onClick={(event) => handleClick(event, product.product_id)}
    >
      <KeyboardArrowDownIcon />
    </IconButton>
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl) && selectedProductId === product.product_id}
      onClose={handleClose}
    >
      <MenuItem onClick={handleEdit}>Düzenle</MenuItem>
      {product.is_active === 1 ? (
        <MenuItem onClick={() => handleListStatusChange1(product.product_id, false)}>Listeden Kaldır</MenuItem>
      ) : (
        <MenuItem onClick={() => handleListStatusChange(product.product_id, true)}>Listele</MenuItem>
      )}
    </Menu>
  </td>
                  </tr>
                </tr>
              ))}
            </tbody>
          </table>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default Products;

