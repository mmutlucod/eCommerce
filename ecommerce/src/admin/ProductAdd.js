import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import api from '../api/api'; // API işlemleri için
import AdminNavbar from '../components/AdminNavbar';

function ProductAdd() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [approvalStatuses, setApprovalStatuses] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    stockCode: '',
    categoryId: '',
    brandId: '',
    price: '',
    approvalStatusId: '',
    approver: ''
  });

  useEffect(() => {
    // Kategorileri, markaları ve onay durumlarını API'den çek
    fetchCategories();
    fetchBrands();
    fetchApprovalStatuses();
  }, []);

  const fetchCategories = async () => {
    const response = await api.get('/admin/categories');
    setCategories(response.data);
  };

  const fetchBrands = async () => {
    const response = await api.get('/admin/brands');
    setBrands(response.data);
  };

  const fetchApprovalStatuses = async () => {
    const response = await api.get('/admin/approvalstatuses');
    setApprovalStatuses(response.data);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/admin/create-product', product);
    // Başarıyla eklendikten sonra formu temizle veya kullanıcıyı başka bir sayfaya yönlendir
  };

  return (
    <>
      <AdminNavbar/>
      <Container maxWidth="sm" component={Paper} elevation={3} sx={{ p: 4, marginTop: 8 }}>
        <Typography variant="h6" gutterBottom>Ürün Ekle</Typography>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ürün Adı"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stok Kodu"
              name="stockCode"
              value={product.stockCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                name="categoryId"
                value={product.categoryId}
                label="Kategori"
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Marka</InputLabel>
              <Select
                name="brandId"
                value={product.brandId}
                label="Marka"
                onChange={handleChange}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Fiyat"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <FormControl fullWidth>
              <InputLabel>Onay Durumu</InputLabel>
              <Select
                name="approvalStatusId"
                value={product.approvalStatusId}
                label="Onay Durumu"
                onChange={handleChange}
              >
                {approvalStatuses.map((status) => (
                  <MenuItem key={status.approval_status_id} value={status.approval_status_id}>{status.status_name}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Ürün Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
      </Container>
    </>
  );
}

export default ProductAdd;


