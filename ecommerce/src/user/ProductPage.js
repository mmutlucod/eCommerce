import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, Chip, CircularProgress } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import ImageCarousel from '../components/ImageCarousel';
import api from '../api/api'; // API dosyanızı import edin

const ProductPage = () => {
  const { productSlug } = useParams(); // Ürün ID'sini URL'den al
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/products/${productSlug}`); // API'den ürün bilgilerini çek
        setProduct(response.data);
      } catch (err) {
        setError('Ürün bilgileri yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Ürün bulunamadı.</Typography>;

  return (
    <>
      <NavBar />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={6}>
          <ImageCarousel images={product.images.map(img => img.url)} />
          <Box sx={{ marginTop: 2 }}>
            {product.features.map((feature, index) => (
              <Typography key={index} variant="body2">
                {`${feature.label}: ${feature.value}`}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{product.brand}</Typography>
          <Rating value={product.rating} readOnly precision={0.1} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {product.price ? `${product.price.toFixed(2)} ₺` : 'Fiyat bilgisi yok'}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="start" mt={2}>
            <Button variant="contained" color="primary">Sepete Ekle</Button>
            {/* Diğer bilgiler ve butonlar */}
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default ProductPage;