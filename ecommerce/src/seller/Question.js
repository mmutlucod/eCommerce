import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');

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
    } catch (error) {
      setErrorMessage('Cevap kaydedilirken bir hata oluştu.');
      console.error('Cevap kaydedilirken bir hata oluştu:', error);
    }
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Sorular
          </Typography>
          {console.log(questions)}
          {loading ? (
            
            <Box display="flex" justifyContent="center" marginTop="20px">
              Yükleniyor...
            </Box>
          ) : (
            <Box>
              {questions.map((question) => (
                <Box key={question.id} mb={2}>
                  <Paper elevation={1} style={{ padding: '10px', backgroundColor: '#f1f1f1' }}>
                  
                    <Typography variant="body1"><strong>Soru:</strong> {question.question}</Typography>
                    {question.answer && (
                      <Typography variant="body1" style={{ marginTop: '10px', color: 'green' }}>
                        <strong>Cevap:</strong> {question.answer}
                      </Typography>
                    )}
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => handleOpenDialog(question)} 
                      style={{ marginTop: '10px' }}
                    >
                      Cevapla
                    </Button>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
      <Dialog open={open} onClose={handleCloseDialog}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            İptal
          </Button>
          <Button onClick={handleSaveAnswer} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(errorMessage) || Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={errorMessage ? "error" : "success"}>
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Questions;
