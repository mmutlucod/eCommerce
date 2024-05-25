import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Rating, Grid, Paper, List, Card, CardHeader, Avatar,
  CardContent, Button, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, TextField, Modal, FormControlLabel, Checkbox
} from '@mui/material';
import { purple } from '@mui/material/colors'; // Mor renk import edildi
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function formatUserName(name, isPublic) {
  if (isPublic === 1) {
    return name;
  } else {
    return name.charAt(0) + '*'.repeat(name.length - 1);
  }
}

function ReviewsTab({ productId, sellerProductId }) {
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({});
  const [selectedRating, setSelectedRating] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning'); // Snackbar severity durumu eklendi


  const { token } = useAuth();

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
    if (!token) {
      setSnackbarMessage('Değerlendirme ekleyebilmek için giriş yapmalısınız.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await api.get(`/user/commentControl/${productId}`);
      if (response.data.success) {
        if (response.data.purchased) {
          // setCanReview(true);
          // setSnackbarMessage('Değerlendirme ekleyebilirsiniz.');
          setModalOpen(true);
        } else {
          setSnackbarMessage('Bu ürüne değerlendirme eklemek için satın almış olmalısınız.');
          setSnackbarSeverity('warning');
          setCanReview(false);
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('warning');
        setCanReview(false);
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error('Error checking purchase:', error);
      setSnackbarMessage('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
      setSnackbarSeverity('error');
      setCanReview(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setNewRating(0);
    setNewComment('');
  };

  const handleSaveReview = async () => {
    try {
      // Kullanıcı bilgilerini çekmek için /user/my-account endpoint'ine istek at
      const userResponse = await api.get('/user/my-account', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = userResponse.data;

      // Yorum kaydetmek için API isteği
      const response = await api.post('/user/create-product-comment', {
        sellerProductId: sellerProductId,
        rating: newRating,
        comment: newComment,
        isPublic: isPublic
      });


      setSnackbarMessage('Yorumunuz gönderildi. Moderatör onayı sonrası herkese gösterilecektir.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleModalClose();

    } catch (error) {
      console.error('Error saving review:', error);
      setSnackbarMessage('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  const handleIsPublicChange = (event) => {
    setIsPublic(event.target.checked);
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal open={modalOpen} onClose={handleModalClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography id="modal-title" variant="h6" component="h2">Değerlendirme Ekle</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend" sx={{ color: purple[500] }}>Puan</Typography>
            <Rating
              name="new-rating"
              value={newRating}
              onChange={(event, newValue) => {
                setNewRating(newValue);
              }}
            />
            <TextField
              label="Yorumunuz"
              multiline
              rows={4}
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                '& .MuiInputLabel-root': { color: purple[500] },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: purple[500] },
                  '&:hover fieldset': { borderColor: purple[700] },
                }
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={handleIsPublicChange}
                  sx={{
                    color: purple[500],
                    '&.Mui-checked': {
                      color: purple[700],
                    }
                  }}
                />
              }
              label="Yorumlarda ismim görünsün."
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{
                mt: 2,
                width: '100%',
                color: 'white',
                bgcolor: '#f27a1a',
                '&:hover': {
                  bgcolor: '#f27a1a'
                }
              }}
              onClick={handleSaveReview}
            >
              Kaydet
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ReviewsTab;
