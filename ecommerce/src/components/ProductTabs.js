import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Avatar, Table, TableBody, TableCell, TableContainer, TableRow, Link, AppBar, Tabs, Tab, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateItem } from '../redux/cartSlice';
import api from '../api/api';
import ReviewsTab from '../components/ReviewsTabs';
import QuestionsTab from '../components/QuestionsTabs';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function OtherSellersTab({ product }) {
  const [tabValue, setTabValue] = useState(0);
  const [sellers, setSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get(`user/sellerProducts/${product.product.product_id}/${product.seller_product_id}`);
        setSellers(response.data);
      } catch (error) {
        console.error('Satıcılar getirilirken hata oluştu:', error);
      }
    };

    const fetchReviewsAndQuestions = async () => {
      try {
        const reviewsResponse = await api.get(`user/product-comments/${product.product.product_id}`);
        setReviews(reviewsResponse.data);

        const questionsResponse = await api.get(`/user/products/${product.product.product_id}/answered-questions/`);
        setQuestions(questionsResponse.data);
      } catch (err) {
        console.error('API error: ', err);
      }
    };

    if (product && product.product_id) {
      fetchSellers();
      fetchReviewsAndQuestions();
    }
  }, [product]);

  const handleAddReview = async () => {
    try {
      const response = await api.post(`user/add-product-comment`, { content: newReview, productId: product.product_id });
      setReviews([...reviews, response.data]);
      setNewReview("");
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
    }
  };



  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSellerClick = (sellerSlug) => {
    navigate(`/satici/${sellerSlug}`);
  };

  const handleAddToCart = useCallback((sellerProduct) => {
    console.log('Adding to cart:', sellerProduct);
    if (!cartItems || !sellerProduct) {
      console.warn('Cart items or product not yet loaded. Please wait a moment.');
      return;
    }

    const existingItem = cartItems.find(item => item.sellerProductId === sellerProduct.seller_product_id);
    console.log('Existing item:', existingItem);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    console.log('New quantity:', newQuantity);

    if (newQuantity > sellerProduct.product.max_buy) {
      setAlertMessage(`Sepete maksimum ${sellerProduct.product.max_buy} adet ürün ekleyebilirsiniz.`);
      setAlertOpen(true);
      return;
    } else if (newQuantity > sellerProduct.stock) {
      setAlertMessage(`Yeterli stok yok. Maksimum alım limiti: ${sellerProduct.stock}`);
      setAlertOpen(true);
      return;
    }

    if (existingItem) {
      console.log('Updating item in cart');
      dispatch(updateItem({
        sellerProductId: sellerProduct.seller_product_id,
        quantity: newQuantity,
        price: sellerProduct.product.price
      }));
    } else {
      console.log('Adding new item to cart');
      dispatch(addItem({
        sellerProductId: sellerProduct.seller_product_id,
        quantity: 1,
        price: sellerProduct.product.price
      }));
    }
  }, [cartItems, dispatch]);

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: '#e0e0e0' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="product details tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Ürün Açıklaması" />
          <Tab label={`Değerlendirmeler (${reviews.length})`} />
          <Tab label={`Soru & Cevap (${questions.length})`} />
          <Tab label="Diğer Satıcılar" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Typography>{product.product.description}</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ReviewsTab productId={product.product.product_id} reviews={reviews} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <QuestionsTab productId={product.product.product_id} questions={questions} seller={product} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" marginBottom={'5px'}>Diğer Satıcılar - Tümü ({sellers.length})</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {sellers.map((seller, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={seller.seller.username} src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56, mr: 2 }} />
                        <Box>
                          <Link
                            component="button"
                            variant="h6"
                            onClick={() => handleSellerClick(seller.seller.slug)}
                            sx={{ fontWeight: 'bold', color: '#0070C0', textDecoration: 'none' }}
                          >
                            {seller.seller.username}
                          </Link>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50', ml: 0.5 }}>
                              {seller.commentAvg}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {seller.price} ₺
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" sx={{ color: 'white' }} onClick={() => handleAddToCart(seller)}>
                        Sepete Ekle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TabPanel>
      {alertOpen && (
        <Alert severity="warning" onClose={() => setAlertOpen(false)} sx={{ mt: 2 }}>
          {alertMessage}
        </Alert>
      )}
    </Box>
  );
}

export default OtherSellersTab;
