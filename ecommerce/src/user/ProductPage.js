import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Grid, Typography, Button, Rating, Paper } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import SimpleImageSlider from '../components/SimpleImageSlider';
import api from '../api/api';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../styles/ProductPage.css';
import ProductTabs from '../components/ProductTabs';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, addItem } from '../redux/cartSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

const ProductPage = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

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

  const handleAddToCart = useCallback((product) => {
    console.log('Adding to cart:', product);
    if (!cartItems || !product) {
      console.warn('Cart items or product not yet loaded. Please wait a moment.');
      return;
    }

    const existingItem = cartItems.find(item => item.sellerProductId === product.seller_product_id);
    console.log('Existing item:', existingItem);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    console.log('New quantity:', newQuantity);

    if (newQuantity > product.product.max_buy) {
      setAlertMessage(`Sepete maksimum ${product.product.max_buy} adet ürün ekleyebilirsiniz.`);
      setAlertOpen(true);
      return;
    } else if (newQuantity > product.stock) {
      setAlertMessage(`Yeterli stok yok. Maksimum alım limiti: ${product.stock}`);
      setAlertOpen(true);
      return;
    }

    if (existingItem) {
      console.log('Updating item in cart');
      dispatch(updateItem({
        sellerProductId: product.seller_product_id,
        quantity: newQuantity,
        price: product.product.price
      }));
    } else {
      console.log('Adding new item to cart');
      dispatch(addItem({
        sellerProductId: product.seller_product_id,
        quantity: 1,
        price: product.product.price
      }));
    }
  }, [cartItems, dispatch, product]);


  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <NavBar />
      <ThemeProvider theme={theme}>
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
                <Button variant="contained" color="secondary" sx={{ width: '100%', mt: 3, py: 1, color: 'white' }} onClick={() => handleAddToCart(product)}>Sepete Ekle</Button>
              </Grid>
            </Grid>
          </Paper>
          {product && <ProductTabs product={product} />}
        </Grid>
        <Footer />
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="warning">
            {alertMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
}

export default ProductPage;
