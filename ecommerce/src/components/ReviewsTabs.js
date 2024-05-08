import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, Button, TextField, Grid, Paper } from '@mui/material';
import api from '../api/api';

function ReviewsTab({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`user/product-comments/${productId}`);
        setReviews(response.data.reviews);
        setRatingSummary(response.data.ratingSummary);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h4">Değerlendirmeler</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {Object.entries(ratingSummary).map(([stars, count]) => (
            <Box key={stars} sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={parseInt(stars)} readOnly />
              <Typography sx={{ ml: 1 }}>{count} ({((count / reviews.length) * 100).toFixed(1)}%)</Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Yorumları Filtrele"
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
          />
          {reviews.filter(review => review.rating === parseInt(filter)).map(review => (
            <Paper key={review.id} sx={{ p: 2, my: 2 }}>
              <Typography variant="h6">{review.user}</Typography>
              <Typography variant="body2">{new Date(review.date).toLocaleDateString()}</Typography>
              <Rating value={review.rating} readOnly />
              <Typography>{review.content}</Typography>
              <Typography sx={{ mt: 1, color: 'green' }}>Bu değerlendirme faydalı mı? {review.helpfulCount}</Typography>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReviewsTab;
