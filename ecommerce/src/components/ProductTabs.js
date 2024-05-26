import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Avatar, Table, TableBody, TableCell, TableContainer, TableRow, Link, AppBar, Tabs, Tab, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateItem } from '../redux/cartSlice';
import api from '../api/api';
import ReviewsTab from '../components/ReviewsTabs';
import QuestionsTab from '../components/QuestionsTabs';
import { useAuth } from '../context/AuthContext';

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
  const [alertSeverity, setAlertSeverity] = useState("warning");
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useAuth();

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
    if (!token) {
      setAlertMessage('Lütfen önce giriş yapınız.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/giris-yap');
      }, 2000);
      return;
    }

    if (!cartItems || !sellerProduct) {
      console.warn('Cart items or product not yet loaded. Please wait a moment.');
      return;
    }

    const existingItem = cartItems.find(item => item.sellerProductId === sellerProduct.seller_product_id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (newQuantity > sellerProduct.product.max_buy) {
      setAlertMessage(`Sepete maksimum ${sellerProduct.product.max_buy} adet ürün ekleyebilirsiniz.`);
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    } else if (newQuantity > sellerProduct.stock) {
      setAlertMessage(`Yeterli stok yok. Maksimum alım limiti: ${sellerProduct.stock}`);
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    if (existingItem) {
      dispatch(updateItem({
        sellerProductId: sellerProduct.seller_product_id,
        quantity: newQuantity,
        price: sellerProduct.product.price
      }));
    } else {
      dispatch(addItem({
        sellerProductId: sellerProduct.seller_product_id,
        quantity: 1,
        price: sellerProduct.product.price
      }));
    }
  }, [cartItems, dispatch, token, navigate]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

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
          <Tab label={`Diğer Satıcılar (${sellers.length})`} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Typography component="div">
          <div dangerouslySetInnerHTML={{ __html: product.product.description }} />
        </Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ReviewsTab productId={product.product.product_id} sellerProductId={product.seller_product_id} reviews={reviews} />
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
                        <Avatar alt={seller.seller.username} src="" sx={{ width: 56, height: 56, mr: 2 }} onClick={() => handleSellerClick(seller.seller.slug)} style={{ cursor: 'pointer' }} />
                        <Box>
                          <div style={{ fontSize: '18px', color: '#4b0082', cursor: 'pointer' }} onClick={() => handleSellerClick(seller.seller.slug)}>
                            {seller.seller.username.toUpperCase()}
                          </div>
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
                      <Button sx={{ marginLeft: '20%' }} variant="text" color="primary" onClick={() => navigate(`/urun/${seller.product.slug}?mg=${seller.seller.slug}`)}>
                        Ürüne Git
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TabPanel>
      <Snackbar open={alertOpen} autoHideDuration={800} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OtherSellersTab;
