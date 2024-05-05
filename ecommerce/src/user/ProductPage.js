import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, Paper, Card, CardContent } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import SimpleImageSlider from '../components/SimpleImageSlider';
import api from '../api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../styles/ProductPage.css';
import ProductTabs from '../components/ProductTabs';
const theme = createTheme({
  palette: {
    primary: {
      main: '#003399',
    },
    secondary: {
      main: '#FF6600',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const ProductPage = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const fetchProductAndSellers = async () => {
      setLoading(true);
      try {
        const productResponse = await api.get(`user/product/${productSlug}`);
        setProduct(productResponse.data);
        setCaption(productResponse.data.product.caption);
      } catch (err) {
        setError('Ürün bilgileri yüklenirken bir hata oluştu: ' + err.message);
      }
      
      try {
        const sellersResponse = await api.get(`user/products/${productSlug}`);
        setSellers(sellersResponse.data.sellers);
      } catch (err) {
        setError('Satıcı bilgileri yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSellers();
  }, [productSlug]);

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Grid container spacing={2} sx={{ maxWidth: 1200, mx: 'auto', my: 5 }}>
        <Paper elevation={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6} className="image-carousel" sx={{ position: 'relative' }}>
              {product && (
                <SimpleImageSlider images={product.product.productImages.map(img => img.image_path)} showNavs={true} />
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography color="text.secondary">{product?.product.Brand.brand_name} </Typography>
                <Typography color="text.secondary">{product?.product?.name} </Typography>
                <Typography color="text.secondary">{product?.product?.category.category_name}</Typography>
              </Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 2 }}>
                {`${product?.price.toFixed(2)} ₺`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={parseFloat(product?.commentAvg) || 0} readOnly precision={0.1} />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>({product?.ratingCount || 0} reviews)</Typography>
              </Box>
              <Button variant="contained" color="secondary" sx={{ width: '100%', mt: 3, py: 1, color: 'white' }}>Sepete Ekle</Button>
              {product?.seller && (
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="body1">Satıcı: {product.seller.username}</Typography>
                    {/* <Rating value={product.product.Seller.rating} readOnly /> */}
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <Typography variant="h6">Özellikler:</Typography>
              <Typography>{product?.product.description || 'Özellik bilgisi yükleniyor...'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Diğer Satıcılar - Tümü ({sellers.length})</Typography>
              {console.log(sellers)}
              {sellers.map(seller => (
                <Box key={seller.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography>{seller.name}</Typography>
                  <Typography>{seller.price} TL</Typography>
                  <Button variant="outlined" color="primary">Sepete Ekle</Button>
                </Box>
              ))}
            </Grid>
          </Grid>
   
        </Paper>
        <ProductTabs product={product} sellers={sellers} />
      </Grid>
      
      <Footer />
    </ThemeProvider>
  );
}

export default ProductPage;
