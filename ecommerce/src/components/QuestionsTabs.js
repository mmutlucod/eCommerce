import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, Paper,
  Dialog, DialogContent, DialogTitle, Link, Checkbox, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import api from '../api/api';

function QuestionsTab({ productId }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [sellerId, setSellerId] = useState(null); // sellerId için state
  const [userId, setUserId] = useState(null); // userId için state
  const [isPublic, setIsPublic] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar türü için state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`user/products/${productId}/answered-questions`);
        if (response.data && response.data.length > 0) {
          setQuestions(response.data.filter(question => question.answer).map(question => ({
            ...question,
            dateAsked: question.date_asked,
            dateAnswered: question.date_answered,
            questionContent: question.question,
            answerContent: question.answer,
            userId: question.user_id,
            sellerId: question.seller_id
          })));
          setSellerId(response.data[0].seller_id);
          setUserId(response.data[0].user_id);
        }
      } catch (error) {
        console.error('Soruları getirirken hata oluştu:', error);
      }
    };

    fetchQuestions();
  }, [productId]);

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  const handleOpenModal = () => {
    const hasPendingQuestion = questions.some(question => question.userId === userId && !question.answerContent);
    if (hasPendingQuestion) {
      setSnackbarMessage('Sorunuz henüz yanıtlanmadı. Lütfen yanıtlanmasını bekleyin.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setOpenModal(true);
      setShowCriteria(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowCriteria(false);
  };

  const toggleCriteria = () => {
    setShowCriteria(!showCriteria);
  };

  const handleIsPublicChange = (event) => {
    setIsPublic(event.target.checked);
  };

  const submitQuestion = async () => {
    try {
      const payload = {
        product_id: productId,
        seller_id: sellerId,
        user_id: userId,
        question: newQuestion,
        date_asked: new Date(),
        is_public: isPublic
      };

      const response = await api.post('user/create-product-question', payload);
      console.log('API Response:', response);
      if (response.status === 200 || response.status === 201) {
        setNewQuestion('');
        setSnackbarMessage('Sorunuz başarıyla gönderildi. Sorularınız sayfasından süreci takip edebilirsiniz.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseModal();
      } else {
        throw new Error(`Soru gönderilirken bir hata oluştu. Durum kodu: ${response.status}`);
      }
    } catch (error) {
      console.error('Soru gönderilirken hata oluştu:', error);
      setSnackbarMessage(`Soru gönderilirken bir hata oluştu: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: 'auto', bgcolor: '#f9f9f9', position: 'relative' }}>
      <Typography variant="h6">Sorular & Cevaplar</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenModal}
        sx={{
          position: 'absolute',
          top: 8,
          right: 16,
          color: 'white',
          bgcolor: '#f27a1a', // Buton arka plan rengi turuncu
          '&:hover': {
            bgcolor: '#f27a1a' // Hover durumu için renk sabit turuncu
          }
        }}
      >
        Soru Sor
      </Button>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>Soru Sor</DialogTitle>
        <DialogContent>
          <Link href="#" onClick={toggleCriteria} sx={{ mb: 2, display: 'block' }}>Soru Sorma Kriterleri</Link>
          {showCriteria && (
            <div style={{ fontSize: '0.8rem' }}>
              <div>Satıcılarımıza sorduğunuz sorular;</div>
              <div>- Ürün ile alakalıysa</div>
              <div>- Reklam içermiyorsa</div>
              <div>- Kullanıcıların ya da satıcıların kişisel haklarına saldırıda bulunmuyorsa</div>
              <div>- Genel ahlak kurallarına aykırı, müstehcen, siyasi veya yasal olmayan içerik bulundurmuyorsa</div>
              <div>Satıcılarımız tarafından yanıtlanır ve yayınlanır.</div>
            </div>
          )}
          <TextField
            label="Bir soru sorun"
            variant="outlined"
            fullWidth
            value={newQuestion}
            onChange={handleQuestionChange}
            multiline
            rows={4}
            sx={{
              my: 2,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                color: 'black',
                '& fieldset': {
                  borderColor: '#4B0082',
                },
                '&:hover fieldset': {
                  borderColor: '#4B0082',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4B0082',
                }
              }
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isPublic}
                onChange={handleIsPublicChange}
                sx={{
                  color: '#f27a1a',

                  '&.Mui-checked': {
                    color: '#f27a1a',
                  }
                }}
              />
            }
            label="Yorumlarda ismim görünsün."
            sx={{
              color: 'black',
              marginBottom: 5,

              fontSize: '0.875rem'
            }}
          />
          <Button variant="contained" onClick={submitQuestion} sx={{
            backgroundColor: '#4B0082',
            color: 'white',

            mt: 4,  // marginTop değerini artırdık
            '&:hover': {
              backgroundColor: '#4B0082'
            }
          }}>
            Soruyu Gönder
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', backgroundColor: 'pistachio', color: 'black' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <List sx={{ mb: 2 }}>
        {questions.map((question, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f27a1a' }}>
                Soru: {question.questionContent}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Sorulduğu Tarih: {new Date(question.dateAsked).toLocaleDateString()}
              </Typography>
              {question.answerContent && (
                <Paper elevation={2} sx={{ mt: 2, p: 2, backgroundColor: '#e0f7fa' }}>
                  <Typography variant="body1">
                    Cevap: {question.answerContent}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    Cevaplandığı Tarih: {new Date(question.dateAnswered).toLocaleDateString()}
                  </Typography>
                </Paper>
              )}
              {!question.answerContent && (
                <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                  Cevap bekleniyor...
                </Typography>
              )}
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default QuestionsTab;
