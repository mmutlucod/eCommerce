import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, AppBar, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
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
  const navigate = useNavigate();

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

  const handleSellerClick = (sellerSlug) => {
    navigate(`/satici/${sellerSlug}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Diğer Satıcılar - Tümü ({sellers.length})</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Satıcı</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Kargoya Veriliş Tarihi</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
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
                    {seller.price} TL
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>Tahmini Teslimat: {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "Bilinmiyor"}</Typography>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" sx={{ color: 'white' }}>
                    Sepete Ekle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
