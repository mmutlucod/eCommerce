import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button, Rating, Grid, CircularProgress, Paper, Divider, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import ImageCarousel from '../components/ImageCarousel';
import { useDispatch } from 'react-redux';
import { updateItem } from '../redux/cartSlice';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';

const CustomCard = styled(Card)(({ theme }) => ({
  flex: '1 0 calc(25% - 16px)',
  maxWidth: 250,
  minHeight: 380,
  margin: '20px 8px',
  transition: '0.3s',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
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
});

const CustomTypography = styled(Typography)({
  color: '#2c3e50',
  fontWeight: 'bold',
});

const CustomButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  display: 'block',
  backgroundColor: '#e67e22',
  color: 'white',
  transition: 'background-color 0.2s',
  fontSize: '1.1rem',
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

const SearchPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { brandSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!brandSlug) {
          setError('Brand not specified');
          setLoading(false);
          return;
        }

        const response = await api.get(`user/brand/${brandSlug}`);
        setAllProducts(response.data);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandSlug]);

  const handleAddToCart = async (product) => {
    dispatch(updateItem({
      sellerProductId: product.seller_product_id,
      quantity: 1
    }));
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
      <Box mt={2} p={2}>
        <CustomPaper elevation={3}>
          <Typography variant="h5">Markalar İçin Gelen Sonuçlar</Typography>
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
            {products.map((product) => (
              <CustomCard key={product.product_id}>
                <ImageCarousel images={(product.product.productImages || []).map(img => img === null ? 'empty.jpg' : img.image_path)} />
                <CustomCardContent>
                  <Box display="flex" justifyContent="start" alignItems="center">
                    <CustomTypography variant="subtitle1" noWrap>
                      {product.product.Brand.brand_name || 'Unknown Brand'}
                    </CustomTypography>
                    <ProductNameTypography variant="subtitle1" noWrap>
                      {product.product.name}
                    </ProductNameTypography>
                  </Box>
                  {product.commentCount > 0 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Rating name="half-rating-read" value={parseFloat(product.commentAvg) || 0} precision={0.5} readOnly />
                      <CustomTypography variant="m" marginRight={'100%'}>
                        {`(${product.commentCount})`}
                      </CustomTypography>
                    </Box>
                  )}
                  <CustomTypography variant="h6" mt={1}>
                    {product.price ? `${product.price.toFixed(2)} ₺` : 'Price Unknown'}
                  </CustomTypography>
                </CustomCardContent>
                <CardActions>
                  <CustomButton size="medium" fullWidth onClick={() => handleAddToCart(product)}>
                    Sepete Ekle
                  </CustomButton>
                </CardActions>
              </CustomCard>
            ))}
          </Box>
        </Grid>
      </Grid>
      <UserFooter />
    </>
  );
};

export default SearchPage;
