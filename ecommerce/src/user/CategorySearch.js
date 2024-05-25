import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button, Rating, Grid, CircularProgress, Paper, Divider, TextField, Snackbar, IconButton, Tooltip } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/api';
import ImageCarousel from '../components/ImageCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, fetchCart, addItem } from '../redux/cartSlice';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';

const CustomCard = styled(Card)(({ theme }) => ({
  flex: '1 0 calc(25% - 16px)',
  maxWidth: 250,
  minHeight: 380,
  margin: '20px 8px',
  transition: '0.3s',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.1)',
    '& $CardMedia': {
      transform: 'scale(1.05)',
    },
    cursor: 'pointer',
  },
}));

const CustomCardContent = styled(CardContent)({
  textAlign: 'left',
  padding: '16px',
  flexGrow: 1,
});

const CustomTypography = styled(Typography)({
  color: '#2c3e50',
  fontWeight: 'bold',
  fontSize: '14px',
  textOverflow: 'clip',
});

const CustomButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  display: 'block',
  backgroundColor: '#e67e22',
  color: 'white',
  transition: 'background-color 0.2s',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#d35400',
  },
}));

const ProductNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#e1bee7',
  padding: '16px',
}));

const FilterBox = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #d1c4e9', // Giriş alanlarının çevresi mor renkte
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CategorySearch = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { categorySlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useAuth();
  const cartItems = useSelector(state => state.cart.items);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!categorySlug) {
          setError('Category not specified');
          setLoading(false);
          return;
        }

        const response = await api.get(`user/category/${categorySlug}`);
        setAllProducts(response.data);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

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

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAddToCart = useCallback((product) => {
    if (!token) {
      setAlertMessage('Lütfen önce giriş yapınız.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/giris-yap');
      }, 2000);
      return;
    }

    if (!cartItems) {
      console.warn('Cart items not yet loaded. Please wait a moment.');
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
        price: product.price
      }));
    } else {
      dispatch(addItem({
        sellerProductId: product.seller_product_id,
        quantity: 1,
        price: product.price
      }));
    }
  }, [cartItems, dispatch, token, navigate]);

  const handleFavoriteToggle = useCallback(async (productId) => {
    if (!token) {
      setAlertMessage('Lütfen önce giriş yapınız.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/giris-yap');
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
  }, [token, favorites, navigate]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handlePriceFilter = () => {
    const filteredProducts = allProducts.filter(product => {
      const price = product.price || 0;
      return price >= (minPrice || 0) && price <= (maxPrice || Number.MAX_SAFE_INTEGER);
    });
    setProducts(filteredProducts);
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <>
      <UserNavbar />
      <Snackbar open={alertOpen} autoHideDuration={800} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Box mt={2} p={2}>
        <CustomPaper elevation={3}>
          <Typography variant="h5">Kategoriler İçin Gelen Sonuçlar</Typography>
        </CustomPaper>
      </Box>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={3}>
          <FilterBox component={Paper} elevation={3}>
            <Typography variant="h6">Filtreleme</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" style={{ color: '#7b1fa2' }}>Fiyat Aralığı</Typography> {/* Fiyat aralığı başlığı mor renkte */}
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <TextField
                  label="En Az"
                  variant="outlined"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  type="number"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#7b1fa2', // Giriş alanı sınırları mor renkte
                      },
                      '&:hover fieldset': {
                        borderColor: '#7b1fa2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                  }}
                />
                <TextField
                  label="En Çok"
                  variant="outlined"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  type="number"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#7b1fa2', // Giriş alanı sınırları mor renkte
                      },
                      '&:hover fieldset': {
                        borderColor: '#7b1fa2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                  }}
                />
              </Box>
              <CustomButton variant="contained" onClick={handlePriceFilter} sx={{ mt: 2 }}>
                Filtrele
              </CustomButton>
            </Box>
          </FilterBox>
        </Grid>
        <Grid item xs={9}>
          <Box display="flex" flexWrap="wrap" justifyContent="center" padding="0 8px" gap={2} border="1px solid #d1c4e9" borderRadius="8px" p={2}>
            {products.length === 0 ? (
              <Typography variant="h6" color="textSecondary">Ürün bulunamamıştır</Typography>
            ) : (
              products.map((product) => (
                <CustomCard key={product.product_id}>
                  <Tooltip title={favorites.includes(product.product.product_id) ? "Favorilerden çıkar" : "Favorilere ekle"}>
                    <FavoriteButton onClick={() => handleFavoriteToggle(product.product.product_id)}>
                      {favorites.includes(product.product.product_id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </FavoriteButton>
                  </Tooltip>
                  <Link to={'/urun/' + product.product.slug}>
                    <ImageCarousel images={(product.product.productImages || []).map(img => img === null ? 'empty.jpg' : img.image_path)} />
                  </Link>
                  <CustomCardContent>
                    <Box display="flex" justifyContent="start" alignItems="center">
                      <Link style={{ textDecoration: 'none', }} to={'/marka/' + product.product.Brand.slug}>
                        <CustomTypography variant="subtitle1" noWrap>
                          {product.product.Brand.brand_name || 'Unknown Brand'}
                        </CustomTypography>
                      </Link>
                      <Link style={{ textDecoration: 'none', overflow: 'hidden' }} to={'/urun/' + product.product.slug}>
                        <Tooltip title={product.product.name}>
                          <ProductNameTypography variant="subtitle1" noWrap>
                            {product.product.name}
                          </ProductNameTypography>
                        </Tooltip>
                      </Link>
                    </Box>
                    {product.commentCount > 0 && (
                      <Tooltip title={`Değerlendirme sayısı: ${product.commentCount}`}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                          <Rating name="half-rating-read" value={parseFloat(product.commentAvg) || 0} precision={0.5} readOnly />
                          <Typography variant="m" marginRight={'100%'} marginLeft={'1.3px'}>
                            {`(${product.commentCount})`}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                    {product.commentCount > 0 ? (
                      <CustomTypography variant="h6" mt={4}>
                        {product.price ? `${product.price.toFixed(2)} ₺` : 'Price Unknown'}
                      </CustomTypography>
                    ) :
                      (
                        <CustomTypography variant="h6" mt={8}>
                          {product.price ? `${product.price.toFixed(2)} ₺` : 'Price Unknown'}
                        </CustomTypography>
                      )}

                  </CustomCardContent>
                  <CardActions sx={{ marginTop: 'auto' }}>
                    <CustomButton size="medium" fullWidth onClick={() => handleAddToCart(product)}>
                      Sepete Ekle
                    </CustomButton>
                  </CardActions>
                </CustomCard>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
      <UserFooter />
    </>
  );
};

export default CategorySearch;
