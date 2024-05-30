import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, Paper, IconButton, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import SimpleImageSlider from '../components/SimpleImageSlider';
import api from '../api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../styles/ProductPage.css';
import ProductTabs from '../components/ProductTabs';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, addItem } from '../redux/cartSlice';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Tooltip } from '@mui/material';

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const ProductPage = () => {
  const { productSlug } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const sellerSlug = queryParams.get('mg');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    const fetchProductAndSellers = async () => {
      setLoading(true);
      try {
        let response;
        if (sellerSlug) {
          response = await api.get(`/user/products/${productSlug}?mg=${sellerSlug}`);
        } else {
          response = await api.get(`/user/product/${productSlug}`);
        }
        if (response.data && response.data.length === 0) {
          throw new Error('Ürün bulunamadı');
        }
        setProduct(response.data[0] || response.data);
      } catch (err) {
        setError('Ürün bulunamadı: ' + err.message);
        setNavigate(true); // 404 sayfasına yönlendirme için state güncellemesi
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSellers();
  }, [productSlug, sellerSlug]);

  useEffect(() => {
    if (token) {
      const fetchFavorites = async () => {
        try {
          const response = await api.get('/user/favorites');
          setFavorites(response.data.map(fav => fav.product_id));
        } catch (err) {
          console.error('Favori ürünler alınırken hata oluştu:', err);
        }
      };

      fetchFavorites();
    }
  }, [token]);

  const handleAddToCart = useCallback((product) => {
    if (!token) {
      setAlertMessage('Lütfen önce giriş yapınız.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      setTimeout(() => {
        window.location.href = '/giris-yap';
      }, 2000);
      return;
    }

    if (!cartItems || !product) {
      console.warn('Cart items or product not yet loaded. Please wait a moment.');
      return;
    }

    const existingItem = cartItems.find(item => item.sellerProductId === product.seller_product_id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (newQuantity > product.product.max_buy) {
      setAlertMessage(`Sepete maksimum ${product.product.max_buy} adet ürün ekleyebilirsiniz.`);
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    } else if (newQuantity > product.stock) {
      setAlertMessage(`Yeterli stok yok. Maksimum alım limiti: ${product.stock}`);
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (existingItem) {
      dispatch(updateItem({
        sellerProductId: product.seller_product_id,
        quantity: newQuantity,
        price: product.product.price
      }));
    } else {
      dispatch(addItem({
        sellerProductId: product.seller_product_id,
        quantity: 1,
        price: product.product.price
      }));
    }
  }, [cartItems, dispatch, product, token]);

  const handleFavoriteToggle = useCallback(async (productId) => {
    if (!token) {
      setAlertMessage('Lütfen önce giriş yapınız.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      setTimeout(() => {
        window.location.href = '/giris-yap';
      }, 2000);
      return;
    }

    try {
      const isFavorited = favorites.includes(productId);
      if (isFavorited) {
        await api.post('/user/deleteFavoriteItem', { productId });
        setFavorites(prev => prev.filter(id => id !== productId));
        setAlertMessage('Ürün favorilerden çıkarıldı.');
        setAlertSeverity('warning');
      } else {
        await api.post('/user/addFavoriteItem', { productId });
        setFavorites(prev => [...prev, productId]);
        setAlertMessage('Ürün favorilere eklendi.');
        setAlertSeverity('success');
      }
      setAlertOpen(true);
    } catch (err) {
      console.error('Favori işlemi sırasında hata oluştu:', err);
    }
  }, [token, favorites]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (navigate) {
    return <Navigate to="/hata" />;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Grid container spacing={2} sx={{ maxWidth: 1200, mx: 'auto', my: 5 }}>
          <Paper elevation={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', p: 3, position: 'relative' }}>
            <Tooltip title={favorites.includes(product.product.product_id) ? "Favorilerden çıkar" : "Favorilere ekle"}>
              <FavoriteButton onClick={() => handleFavoriteToggle(product.product.product_id)}>
                {favorites.includes(product.product.product_id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </FavoriteButton>
            </Tooltip>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6} className="image-carousel" sx={{ position: 'relative' }}>
                {product && product.product.productImages && (
                  <SimpleImageSlider images={product.product.productImages.map(img => img.image_path)} showNavs={true} />
                )}
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Link to={'/marka/' + product?.product.Brand.slug} style={{ textDecoration: 'none' }}>
                    <Typography fontWeight={'bold'} color="#ff6600">{product?.product.Brand.brand_name} </Typography>
                  </Link>
                  <Typography color="text.secondary">{product?.product?.name} </Typography>
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', gap: 1, mt: -1 }}>
                  <Typography color="text.secondary">Satıcı: </Typography>
                  <Link to={'/satici/' + product?.seller.slug} style={{ textDecoration: 'none' }}>
                    <Typography fontWeight={'bold'} color="#4B0082">{product?.seller.username} </Typography>
                  </Link>
                </Typography>
                {
                  product?.commentCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, }}>
                      <Rating value={parseFloat(product?.commentAvg) || 0} readOnly precision={0.1} />
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({product.commentCount} değerlendirme)
                      </Typography>
                    </Box>
                  )
                }
                <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 2 }}>
                  {`${product?.price.toFixed(2)} ₺`}
                </Typography>
                {product.stock > 0 ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: '100%', mt: 3, py: 1, color: 'white' }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Sepete Ekle
                  </Button>
                ) : (
                  <Typography variant="h6" color="error" sx={{ mb: 3, mx: 'auto' }}>
                    Bu satıcıda stok bulunamadı. Diğer satıcılara göz atın.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
          {product && <ProductTabs product={product} sellerProductId={product.seller_product_id} />}
        </Grid>
        <Footer />
        <Snackbar open={alertOpen} autoHideDuration={800} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
}

export default ProductPage;
