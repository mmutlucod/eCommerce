import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, Grid, Paper, List, Card, CardHeader, Avatar, CardContent, IconButton, Link, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`user/product-comments/${productId}`);
        console.log('API Response:', response.data);
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

  const filteredReviews = reviews.filter(review => review.rating.toString().includes(selectedRating));

  if (filteredReviews.length > 0) {
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
            <FormControl fullWidth>
              <InputLabel id="rating-select-label">Filtrele</InputLabel>
              <Select
                labelId="rating-select-label"
                id="rating-select"
                value={selectedRating}
                label="Filter by Rating"
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
            <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
              {filteredReviews.map((review) => (
                <Card key={review.id} variant="outlined" sx={{ mb: 2, bgcolor: 'grey.200' }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {review.user.name[0]}{review.user.surname[0]}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={`${review.user.name} ${review.user.surname}`}
                    subheader={review.date}
                    titleTypographyProps={{ variant: 'subtitle2' }}
                    subheaderTypographyProps={{ variant: 'caption' }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {review.content}
                    </Typography>
                    <Rating value={review.rating} readOnly sx={{ mt: 1 }} />
                    <Link href="#" underline="always" sx={{ display: 'block', mt: 1, fontSize: '0.75rem' }}>
                      Bildir
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    );
  }
  else {
    return (
      <Typography variant="body2" sx={{ mt: 5, color: 'gray' }}>
        Bu ürüne henüz yorum yapılmadı.
      </Typography>
    )
  }

}

export default ReviewsTab;
