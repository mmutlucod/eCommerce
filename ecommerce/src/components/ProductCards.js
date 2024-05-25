import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Rating, Typography, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import ImageCarousel from '../components/ImageCarousel';
import { updateItem, addItem } from '../redux/cartSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
  height: '110px',
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

const CommentTypography = styled(Typography)({
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
  '&:hover': {
    backgroundColor: '#d35400',
  },
}));

const ProductNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: '6px',
  fontSize: '14px',
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ProductCards = ({ products = [] }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const handleAddToCart = useCallback((product) => {
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


  }, [cartItems, dispatch]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (!products || products.length === 0) {
    return <Typography>No products available.</Typography>;
  }

  return (
    <>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Box display="flex" flexWrap="wrap" justifyContent="center" padding="0 8px" gap={2}>
        {products.map((product) => (
          <CustomCard key={product.product_id}>
            {product.fastDelivery && <Badge color="error" badgeContent="Fast Delivery" />}
            <Link to={'/urun/' + product.product.slug} >
              {product.product.productImages ? (
                <ImageCarousel images={product.product.productImages.map(img => img.image_path)} />
              ) : (
                <Typography>No images available</Typography>
              )}
            </Link>
            <CustomCardContent>
              <Box display="flex" justifyContent="start" alignItems="center">
                <Link style={{ textDecoration: 'none', overflow: 'hidden' }} to={'/marka/' + product.product.Brand.slug}>
                  <CustomTypography variant="subtitle1" noWrap>
                    {product.product.Brand.brand_name || 'Unknown Brand'}
                  </CustomTypography>
                </Link>
                <Link style={{ textDecoration: 'none', overflow: 'hidden' }} to={'/urun/' + product.product.slug}>
                  <ProductNameTypography variant="subtitle1" noWrap>
                    {product.product.name}
                  </ProductNameTypography>
                </Link>
              </Box>
              {product.commentCount > 0 && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Rating name="half-rating-read" value={parseFloat(product.commentAvg) || 0} precision={0.5} readOnly />
                  <CommentTypography variant="m" marginRight={'100%'} marginLeft={'1.3px'}>
                    {`(${product.commentCount})`}
                  </CommentTypography>
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
      </Box >
    </>
  );
};


export default ProductCards;
