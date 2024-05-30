import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Paper,
  Typography,
  Snackbar,
  CircularProgress,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Tooltip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';
import ImageCarousel from '../components/ImageCarousel';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomCard = styled(Card)(({ theme }) => ({
  flex: '1 0 calc(25% - 16px)',
  maxWidth: 250,
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
  padding: '15px',
  height: '250px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const CustomTypography = styled(Typography)({
  color: '#2c3e50',
  fontWeight: 'bold',
  fontSize: '14px',
  textOverflow: 'clip',
  marginRight: '4px'
});

const CustomButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  display: 'block',
  backgroundColor: '#e67e22',
  color: 'white',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#d35400',
  },
}));

const ProductNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: '6px',
  fontSize: '14px',
}));

const ProductAdd = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    if (value.trim().length > 2) {
      setLoading(true);
      try {
        const response = await api.get('/seller/searchAllProducts', { params: { search: value } });
        setSearchResults(response.data);
      } catch (error) {
        setErrorMessage('Arama yapılırken bir hata oluştu.');
        console.error('Arama yapılırken bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleProductBind = async (productId) => {
    setLoading(true);
    try {
      await api.post('/seller/create-seller-product', { product_id: productId });
      setSuccessMessage('Ürün başarıyla satıcıya bağlandı.');
    } catch (error) {
      setErrorMessage('Ürün bağlanırken bir hata oluştu.');
      console.error('Ürün bağlanırken bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddProductClick = () => {
    navigate('/urun-ekle');
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Ürün Ara
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Ürün Ara"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Ürün ismi giriniz..."
          />
          {loading && <CircularProgress />}
        </Paper>
        <Box display="flex" flexWrap="wrap" justifyContent="center" padding="0 8px" gap={2}>
          {searchQuery.length > 2 && searchResults.length === 0 && !loading && (
            <Button
              variant="contained"
              color="warning"
              size="large"
              onClick={handleAddProductClick}
              style={{ marginTop: '20px' }}
            >
              Aradığınız ürün yoksa ekleme yapabilirsiniz
            </Button>
          )}
          {searchResults.length > 0 && searchResults.map((product) => (
            <CustomCard key={product.product_id}>
              <CustomCardContent>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <CustomTypography variant="subtitle1">
                    {product.Brand.brand_name || 'Unknown Brand'}
                  </CustomTypography>
                  <Tooltip title={product.name}>
                    <ProductNameTypography variant="subtitle1" noWrap>
                      {product.name}
                    </ProductNameTypography>
                  </Tooltip>
                </Box>
                <ImageCarousel images={product.productImages.map(img => img.image_path)} /> {/* Resim carousel'i ekliyoruz */}
                <CustomTypography variant="h6" mt={1}>
                  Stok Kodu: {product.stock_code}
                </CustomTypography>
              </CustomCardContent>
              <CardActions>
                <CustomButton size="medium" fullWidth onClick={() => handleProductBind(product.product_id)}>
                  Ürünü Bağla
                </CustomButton>
              </CardActions>
            </CustomCard>
          ))}
        </Box>
      </Container>
      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductAdd;