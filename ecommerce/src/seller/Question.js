import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, Paper,
  Dialog, DialogContent, DialogTitle, Snackbar, Alert, IconButton
} from '@mui/material';
import SellerNavbar from '../components/SellerNavbar';
import SellerFooter from '../components/SellerFooter';
import api from '../api/api';
import AnswerIcon from '@mui/icons-material/QuestionAnswer';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('seller/my-questions');
        setQuestions(response.data);
      } catch (error) {
        setErrorMessage('Sorular yüklenirken bir hata oluştu.');
        console.error('Sorular yüklenirken bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleCloseSnackbar = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (question) => {
    setSelectedQuestion(question);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedQuestion(null);
    setAnswer('');
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSaveAnswer = async () => {
    try {
      await api.patch(`seller/my-questions/${selectedQuestion.question_id}`, { answer });
      setQuestions((prevQuestions) => prevQuestions.map((q) => 
        q.id === selectedQuestion.id ? { ...q, answer } : q
      ));
      setSuccessMessage('Cevap başarıyla kaydedildi.');
      handleCloseDialog();
      setSnackbarMessage('Cevap başarıyla kaydedildi.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage('Cevap kaydedilirken bir hata oluştu.');
      setSnackbarMessage('Cevap kaydedilirken bir hata oluştu.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Cevap kaydedilirken bir hata oluştu:', error);
    }
  };

  const groupedQuestions = questions.reduce((groups, question) => {
    const product = question.product.name;
    if (!groups[product]) {
      groups[product] = [];
    }
    groups[product].push(question);
    return groups;
  }, {});

  return (
    <>
      <SellerNavbar />
      <Box sx={{ p: 2, maxWidth: 800, margin: 'auto', bgcolor: '#f9f9f9', position: 'relative' }}>
        <Typography variant="h6" sx={{ ml: 2 }}>Sorular & Cevaplar</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" marginTop="20px">
            Yükleniyor...
          </Box>
        ) : (
          Object.entries(groupedQuestions).map(([product, productQuestions]) => (
            <Box key={product} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4B0082', ml: 2 }}>
                {product}
              </Typography>
              {console.log(questions)}
              <List sx={{ mb: 2, ml: 2 }}>
                {productQuestions.map((question) => (
                  <ListItem key={question.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                    <Paper elevation={3} sx={{ p: 2, width: '92%', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f27a1a' }}>
                            Soru: {question.question}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Sorulduğu Tarih: {new Date(question.date_asked).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {!question.answer && (
                          <IconButton onClick={() => handleOpenDialog(question)} color="primary">
                            <AnswerIcon />
                          </IconButton>
                        )}
                      </Box>
                      {question.answer && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e0f7fa' }}>
                          <Typography variant="body1">
                            Cevap: {question.answer}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            Cevaplandığı Tarih: {new Date(question.date_answered).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        )}
      </Box>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Soruya Cevap Ver</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cevap"
            fullWidth
            multiline
            rows={4}
            value={answer}
            onChange={handleAnswerChange}
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
          <Button variant="contained" onClick={handleSaveAnswer} sx={{
            backgroundColor: '#4B0082',
            color: 'white',
            mt: 4,
            width: '100%',
            '&:hover': {
              backgroundColor: '#4B0082'
            }
          }}>
            Kaydet
          </Button>
        </DialogContent>
      </Dialog>
      <Snackbar open={Boolean(errorMessage) || Boolean(successMessage) || snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={errorMessage ? "error" : "success"} sx={{ width: '100%' }}>
          {errorMessage || successMessage || snackbarMessage}
        </Alert>
      </Snackbar>
      <SellerFooter />
    </>
  );
};

export default Questions;
