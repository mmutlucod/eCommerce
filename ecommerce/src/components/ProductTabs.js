import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, AppBar, Typography, Paper, Button } from '@mui/material';
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

function OtherSellersTab({ productId }) {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get(`user/sellerProducts/${productId}`);
        setSellers(response.data);
      } catch (error) {
        console.error('Satıcılar getirilirken hata oluştu:', error);
      }
    };

    fetchSellers();
  }, [productId]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Diğer Satıcılar - Tümü ({sellers.length})</Typography>
      {sellers.map((seller, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
              {seller.rating}
            </Typography>
            <Typography variant="subtitle2">{seller.name}</Typography>
            <Typography variant="body2">{seller.estimatedDelivery}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {seller.price} TL
            </Typography>
            <Button variant="contained" color="secondary">
              Sepete Ekle
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

function ProductTabs({ product }) {
  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    const fetchReviewsAndQuestions = async () => {
      try {
        const reviewsResponse = await api.get(`user/product-comments/${product.product_id}`);
        setReviews(reviewsResponse.data);

        const questionsResponse = await api.get(`user/questions/${product.product_id}`);
        setQuestions(questionsResponse.data);
      } catch (err) {
        console.error('API error: ', err);
      }
    };

    if (product && product.product_id) {
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

  const handleAddQuestion = async () => {
    try {
      const response = await api.post(`user/add-question`, { content: newQuestion, productId: product.product_id });
      setQuestions([...questions, response.data]);
      setNewQuestion("");
    } catch (error) {
      console.error('Soru eklenirken hata oluştu:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
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
          <Tab label="Diğer Satıcılar" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Typography>{product.description}</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ReviewsTab productId={product.product_id} reviews={reviews} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <QuestionsTab productId={product.product_id} questions={questions} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <OtherSellersTab productId={product.product_id} />
      </TabPanel>
    </Box>
  );
}

export default ProductTabs;
