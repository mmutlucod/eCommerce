import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, CircularProgress, Paper, Divider } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import SimpleImageCarousel from '../components/SimpleImageSlider';
import api from '../api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../styles/ProductPage.css'; // CSS dosyasını buraya import ediyoruz
import SimpleImageSlider from '../components/SimpleImageSlider';

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
    h5: {
      fontWeight: 'bold',
    },
  },
});
const ProductPage = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAndSellers = async () => {
      try {
        const productResponse = await api.get(`user/product/${productSlug}`);
        setProduct(productResponse.data);
        if (productResponse.data.sellers) {
          setSellers(productResponse.data.sellers);  // Sellers verisini kontrol et
        }
      } catch (err) {
        setError('Ürün bilgileri yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSellers();
  }, [productSlug]);

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Grid container className="product-page-container" sx={{ height: 680 }}>
        <Grid item xs={6} sx={{ backgroundColor: 'white' }}>  
          {/* <div className="image-carousel">
            <SimpleImageSlider images={product.product.productImages.map(img => img.image_path)} />
          </div> */}
          <Typography variant="h5" className="product-description">{product?.description}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#F0F0F0', padding: 2 }}>  
          <div className="product-details">
            <Typography variant="h4">{product?.name}</Typography>
            <Typography variant="h6">{product?.brand}</Typography>
            <Rating value={parseFloat(product?.rating) || 0} readOnly precision={0.1} />
            <Typography>{product?.price ? `${product.price.toFixed(2)} ₺` : 'Fiyat bilgisi yok'}</Typography>
            <Button variant="contained" color="primary">Sepete Ekle</Button>
          </div>
          <Divider />
          <div className="other-sellers">
            <Typography variant="h6">Diğer Satıcılar - Tümü ({sellers.length})</Typography>
            {sellers && sellers.map(seller => (
              <Box key={seller.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 }}>
                <Typography>{seller.name}</Typography>
                <Typography>{seller.price} TL</Typography>
                <Button variant="outlined" color="primary">Sepete Ekle</Button>
              </Box>
            ))}
          </div>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
}



export default ProductPage;
