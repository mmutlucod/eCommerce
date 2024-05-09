import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Paper } from '@mui/material';
import api from '../api/api';

function QuestionsTab({ productId }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    // Ürün ID'sine bağlı soruları getir
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`user/products/${productId}/answered-questions`);
        if (response.data) {
          setQuestions(response.data.map(question => ({
            ...question,
            dateAsked: question.date_asked,
            dateAnswered: question.date_answered,
            questionContent: question.question,
            answerContent: question.answer,
            userId: question.user_id,
            sellerId: question.seller_id
          })));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [productId]);

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  // Soru gönder
  const submitQuestion = async () => {
    try {
      const response = await api.post(`user/create-product-question`, { content: newQuestion });
      if (response.status === 200) {
        setQuestions([...questions, { ...response.data, questionContent: newQuestion }]);
        setNewQuestion('');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: 'auto', bgcolor: '#f9f9f9' }}>
      <Typography variant="h6">Questions & Answers</Typography>
      <List sx={{ mb: 2 }}>
        {questions.map((question, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Soru: {question.questionContent}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Soruldu: {new Date(question.dateAsked).toLocaleDateString()}
              </Typography>
              {question.answerContent && (
                <Paper elevation={2} sx={{ mt: 2, p: 2, backgroundColor: '#e0f7fa' }}>
                  <Typography variant="body1">
                    Cevap: {question.answerContent}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {new Date(question.dateAnswered).toLocaleDateString()}
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
      <TextField
        label="Bir soru sorun"
        variant="outlined"
        fullWidth
        value={newQuestion}
        onChange={handleQuestionChange}
        multiline
        rows={4}
        sx={{ my: 2 }}
      />
      <Button variant="contained" color="primary" onClick={submitQuestion} disabled={!newQuestion.trim()}>
        Soru Gönder
      </Button>
    </Box>
  );
}

export default QuestionsTab;
