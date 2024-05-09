import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, AppBar, Typography, TextField, Button } from '@mui/material';
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

function ProductTabs({ product }) {
  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    const fetchReviewsAndQuestions = async () => {
      try {
        const reviewsResponse = await api.get(`user/product-comments/${product.id}`);
        setReviews(reviewsResponse.data);

        const questionsResponse = await api.get(`user/questions/${product.id}`);
        setQuestions(questionsResponse.data);
      } catch (err) {
        console.error('API error: ', err);
      }
    };

    if (product && product.id) {
      fetchReviewsAndQuestions();
    }
  }, [product]);

  const handleAddReview = async () => {
    try {
      const response = await api.post(`user/add-product-comment`, { content: newReview, productId: product.id });
      setReviews([...reviews, response.data]);
      setNewReview("");
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await api.post(`user/add-question`, { content: newQuestion, productId: product.id });
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
        >{reviews}
          <Tab label="Ürün Açıklaması" />
          <Tab label={`Değerlendirmeler `} />
          <Tab label="Soru & Cevap" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Typography>{product.description}</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ReviewsTab productId={product.product_id} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <QuestionsTab productId={product.product_id} />
      </TabPanel>
    </Box>
  );
}

export default ProductTabs;
