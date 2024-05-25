import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Rating, Grid, Paper, List, Card, CardHeader, Avatar,
  CardContent, Button, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import api from '../api/api';

function formatUserName(name, isPublic) {
  if (isPublic === 1) {
    return name;
  } else {
    return name.charAt(0) + '*'.repeat(name.length - 1);
  }
}

function ReviewsTab({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({});
  const [selectedRating, setSelectedRating] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`user/product-comments/${productId}`);
        if (response.data) {
          setReviews(response.data.map(item => ({
            id: item.comment_id,
            userId: item.user_id,
            title: item.comment,
            content: item.comment,
            rating: item.rating,
            date: item.comment_date,
            user: {
              name: formatUserName(item.user.name, item.is_public),
              surname: formatUserName(item.user.surname, item.is_public),
            },
            isPublic: item.is_public,
          })));

          const summary = {};
          response.data.forEach(item => {
            summary[item.rating] = (summary[item.rating] || 0) + 1;
          });
          setRatingSummary(summary);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  const handleReviewButtonClick = async () => {
    try {
      const response = await api.get(`/user/commentControl/${productId}`);
      console.log(response.data)
      if (response.data.success) {
        if (response.data.purchased) {
          setCanReview(true);
          setSnackbarMessage('Değerlendirme ekleyebilirsiniz.');
        } else {
          setSnackbarMessage('Bu ürüne değerlendirme eklemek için satın almış olmalısınız.');
          setCanReview(false);
        }
      } else {
        setSnackbarMessage(response.data.message);
        setCanReview(false);
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error checking purchase:', error);
      setSnackbarMessage('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
      setCanReview(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredReviews = reviews.filter(review => review.rating.toString().includes(selectedRating));

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Genel Puan</Typography>
            {Object.keys(ratingSummary).sort((a, b) => b - a).map((key) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={parseInt(key)} readOnly />
                <Typography sx={{ ml: 1 }}>{ratingSummary[key]} değerlendirme</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl sx={{ width: '70%' }}>
              <InputLabel id="rating-select-label">Filtrele</InputLabel>
              <Select
                labelId="rating-select-label"
                id="rating-select"
                value={selectedRating}
                label="Filtrele"
                onChange={handleRatingChange}
              >
                <MenuItem value="">
                  <em>Yıldız Sayısı Seçiniz</em>
                </MenuItem>
                {[1, 2, 3, 4, 5].map(rating => (
                  <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                height: 56,
                color: 'white',
                bgcolor: '#f27a1a',
                '&:hover': {
                  bgcolor: '#f27a1a'
                }
              }}
              onClick={handleReviewButtonClick}
            >
              Değerlendirme Ekle
            </Button>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
            {filteredReviews.length > 0 ? filteredReviews.map((review) => (
              <Card key={review.id} variant="outlined" sx={{ mb: 2, bgcolor: 'grey.200' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {review.user.name[0]}{review.user.surname[0]}
                    </Avatar>
                  }
                  title={`${review.user.name} ${review.user.surname}`}
                  subheader={new Date(review.date).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  subheaderTypographyProps={{ variant: 'caption' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {review.content}
                  </Typography>
                  <Rating value={review.rating} readOnly sx={{ mt: 1 }} />
                  <Button variant="text" size="small" sx={{ mt: 1 }}>
                    Bildir
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <Typography variant="body2" sx={{ mt: 5, color: 'gray' }}>
                Bu ürüne henüz yorum yapılmadı.
              </Typography>
            )}
          </List>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={1200} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReviewsTab;
