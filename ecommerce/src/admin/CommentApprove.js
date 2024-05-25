import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Paper, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/api'; // Yolu doğru belirleyin

function CommentApprove() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get('/admin/comments'); // Yorumları çekmek için doğru endpointi kullanın
        setComments(response.data);
      } catch (error) {
        console.error("Yorumları çekerken hata oluştu:", error);
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      await api.put(`/admin/approve/product/${commentId}/1`); // Onay için endpointi kullanın
      setComments(comments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error("Yorumu onaylarken hata oluştu:", error);
    }
  };

  const handleReject = async (commentId) => {
    try {
      await api.put(`/admin/approve/product/${commentId}/2`); // Reddetmek için endpointi kullanın
      setComments(comments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error("Yorumu reddederken hata oluştu:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h4" gutterBottom>Yorum Onaylama</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Yorum ID</TableCell>
                      <TableCell>Ürün ID</TableCell>
                      <TableCell>Kullanıcı</TableCell>
                      <TableCell>Yorum</TableCell>
                      <TableCell>Puan</TableCell>
                      <TableCell>Onay</TableCell>
                      <TableCell>Reddet</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment.comment_id}>
                        <TableCell>{comment.comment_id}</TableCell>
                        <TableCell>{comment.product_id}</TableCell>
                        <TableCell>{comment.user.name}</TableCell>
                        <TableCell>{comment.comment}</TableCell>
                        <TableCell>{comment.rating}</TableCell>
                        <TableCell>
                          <IconButton color="success" onClick={() => handleApprove(comment.comment_id)}>
                            <CheckCircleIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleReject(comment.comment_id)}>
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default CommentApprove;
