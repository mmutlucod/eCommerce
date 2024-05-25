import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Snackbar, Alert, CircularProgress, Backdrop
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../api/api'; // Yolu doğru belirleyin

function QuestionApprove() {
  const [questions, setQuestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [rejectedQuestions, setRejectedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('admin/getProductQuestions');
      const sortedQuestions = response.data.sort((a, b) => b.approval_status_id === 3 ? 1 : -1); // Onay bekleyen sorular üste
      setQuestions(sortedQuestions);
      setApprovedQuestions(response.data.filter(question => question.approval_status_id === 1));
      setRejectedQuestions(response.data.filter(question => question.approval_status_id === 2));
    } catch (error) {
      console.error("Soruları çekerken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, questionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestionId(questionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.put(`admin/approve/question/${selectedQuestionId}/1`); // Onay için endpointi kullanın
      setSnackbarMessage('Soru başarıyla onaylandı.');
      setSnackbarSeverity('success');
      await fetchQuestions(); // Soruları tekrar çek
    } catch (error) {
      console.error("Soruyu onaylarken hata oluştu:", error);
      setSnackbarMessage('Soruyu onaylarken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setActionLoading(false);
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.put(`admin/approve/question/${selectedQuestionId}/2`); // Reddetmek için endpointi kullanın
      setSnackbarMessage('Soru başarıyla reddedildi.');
      setSnackbarSeverity('success');
      await fetchQuestions(); // Soruları tekrar çek
    } catch (error) {
      console.error("Soruyu reddederken hata oluştu:", error);
      setSnackbarMessage('Soruyu reddederken bir hata oluştu.');
      setSnackbarSeverity('error');
    } finally {
      setActionLoading(false);
      setSnackbarOpen(true);
      handleMenuClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container sx={{ py: 2 }}>
          <Typography variant="h4" gutterBottom>Soru Onaylama</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Soru ID</TableCell>
                          <TableCell>Ürün Adı</TableCell>
                          <TableCell>Ürün Fiyat</TableCell>
                          <TableCell>Soru</TableCell>
                          <TableCell>Kullanıcı Adı</TableCell>
                          <TableCell>Kullanıcı Maili</TableCell>
                          <TableCell>Satıcı Adı</TableCell>
                          <TableCell>Satıcı Maili</TableCell>
                          <TableCell>Durumu</TableCell>
                          <TableCell>İşlemler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {questions.filter(question => question.approval_status_id === 3).map((question) => (
                          <TableRow key={question.question_id}>
                            <TableCell>{question.question_id}</TableCell>
                            <TableCell>{question.product ? question.product.name : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.product ? question.product.price : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.question}</TableCell>
                            <TableCell>{question.user ? question.user.name : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.user ? question.user.email : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.seller ? question.seller.name : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.seller ? question.seller.email : 'Bilinmiyor'}</TableCell>
                            <TableCell>{question.ApprovalStatus.status_name}</TableCell>
                            <TableCell>
                              <IconButton onClick={(event) => handleMenuOpen(event, question.question_id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                sx={{ '& .MuiPaper-root': { border: 'none' } }}
                              >
                                <MenuItem onClick={handleApprove}>
                                  <CheckCircleIcon fontSize="small" /> Onayla
                                </MenuItem>
                                <MenuItem onClick={handleReject}>
                                  <CancelIcon fontSize="small" /> Reddet
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">Onaylanan Sorular</Typography>
                  {approvedQuestions.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Soru ID</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Ürün Fiyat</TableCell>
                            <TableCell>Soru</TableCell>
                            <TableCell>Kullanıcı Adı</TableCell>
                            <TableCell>Kullanıcı Maili</TableCell>
                            <TableCell>Satıcı Adı</TableCell>
                            <TableCell>Satıcı Maili</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approvedQuestions.map((question) => (
                            <TableRow key={question.question_id}>
                              <TableCell>{question.question_id}</TableCell>
                              <TableCell>{question.product ? question.product.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.product ? question.product.price : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.question}</TableCell>
                              <TableCell>{question.user ? question.user.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.user ? question.user.email : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.seller ? question.seller.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.seller ? question.seller.email : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz onaylanan bir soru yok.</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Reddedilen Sorular</Typography>
                  {rejectedQuestions.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Soru ID</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Ürün Fiyat</TableCell>
                            <TableCell>Soru</TableCell>
                            <TableCell>Kullanıcı Adı</TableCell>
                            <TableCell>Kullanıcı Maili</TableCell>
                            <TableCell>Satıcı Adı</TableCell>
                            <TableCell>Satıcı Maili</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rejectedQuestions.map((question) => (
                            <TableRow key={question.question_id}>
                              <TableCell>{question.question_id}</TableCell>
                              <TableCell>{question.product ? question.product.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.product ? question.product.price : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.question}</TableCell>
                              <TableCell>{question.user ? question.user.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.user ? question.user.email : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.seller ? question.seller.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{question.seller ? question.seller.email : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz reddedilen bir soru yok.</Typography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={actionLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default QuestionApprove;
