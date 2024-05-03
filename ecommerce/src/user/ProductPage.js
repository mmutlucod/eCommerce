import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, CircularProgress, Paper } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import ImageCarousel from '../components/ImageCarousel';
import api from '../api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../styles/ProductPage.css'; // CSS dosyasını buraya import ediyoruz

// Tema özelleştirmesi
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAndSellers = async () => {
      setLoading(true);
      try {
        const productResponse = await api.get(`user/product/${productSlug}`);
        setProduct(productResponse.data);
       
      } catch (err) {
        setError('Ürün bilgileri yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSellers();
  }, [productSlug]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Ürün bulunamadı.</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      {console.log(product)}
      <div className="product-container">
        <div className="image-carousel-container">
          {product.images && <ImageCarousel images={product.images.map(img => img.url)} />}
        </div>
        <div className="product-details">
          <h1 className="product-name">{product.name}</h1>
          <h2 className="product-brand">{product.brand}</h2>
          <Rating className="product-rating" value={parseFloat(product.rating) || 0} readOnly precision={0.1} />
          <p className="product-price">{product.price ? `${product.price.toFixed(2)} ₺` : 'Fiyat bilgisi yok'}</p>
          <Button variant="contained" color="primary" className="add-to-cart-button">Sepete Ekle</Button>
        </div>
        <div className="other-sellers">
          <h3>Diğer Satıcılar - Tümü ({sellers.length})</h3>
          {sellers.map(seller => (
            <div key={seller.id} className="seller">
              <span className="seller-rating">{seller.rating}</span>
              <span className="seller-shipment">{seller.shipment}</span>
              <span className="seller-price">{seller.price} TL</span>
              <Button variant="outlined" color="primary">Sepete Ekle</Button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default ProductPage;
