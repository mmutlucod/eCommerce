import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Snackbar, Alert, CircularProgress, Backdrop
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../api/api'; // Yolu doğru belirleyin

function CommentApprove() {
  const [comments, setComments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedComments, setApprovedComments] = useState([]);
  const [rejectedComments, setRejectedComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('admin/getProductComments');
      const sortedComments = response.data.sort((a, b) => b.approval_status_id === 3 ? 1 : -1); // Onay bekleyen yorumlar üste
      setComments(sortedComments);
      setApprovedComments(response.data.filter(comment => comment.approval_status_id === 1));
      setRejectedComments(response.data.filter(comment => comment.approval_status_id === 2));
    } catch (error) {
      console.error("Yorumları çekerken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.put(`admin/approve/comment/${selectedCommentId}/1`); // Onay için endpointi kullanın
      setSnackbarMessage('Yorum başarıyla onaylandı.');
      setSnackbarSeverity('success');
      await fetchComments(); // Yorumları tekrar çek
    } catch (error) {
      console.error("Yorumu onaylarken hata oluştu:", error);
      setSnackbarMessage('Yorumu onaylarken bir hata oluştu.');
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
      await api.put(`admin/approve/comment/${selectedCommentId}/2`); // Reddetmek için endpointi kullanın
      setSnackbarMessage('Yorum başarıyla reddedildi.');
      setSnackbarSeverity('success');
      await fetchComments(); // Yorumları tekrar çek
    } catch (error) {
      console.error("Yorumu reddederken hata oluştu:", error);
      setSnackbarMessage('Yorumu reddederken bir hata oluştu.');
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
          <Typography variant="h4" gutterBottom>Yorum Onaylama</Typography>
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
                          <TableCell>Yorum ID</TableCell>
                          <TableCell>Yorum</TableCell>
                          <TableCell>Puan</TableCell>
                          <TableCell>Kullanıcı</TableCell>
                          <TableCell>Kullanıcı Mail</TableCell>
                          <TableCell>Ürün</TableCell>
                          <TableCell>Ürün Fiyatı</TableCell>
                          <TableCell>Durumu</TableCell>
                          <TableCell>İşlemler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {comments.filter(comment => comment.approval_status_id === 3).map((comment) => (
                          <TableRow key={comment.comment_id}>
                            <TableCell>{comment.comment_id}</TableCell>
                            <TableCell>{comment.comment}</TableCell>
                            <TableCell>{comment.rating}</TableCell>
                            {console.log(comment.sellerProduct.product.price)}
                            <TableCell>{comment.user ? `${comment.user.name} ${comment.user.surname}` : 'Bilinmiyor'}</TableCell>
                            <TableCell>{comment.user ? comment.user.email : 'Bilinmiyor'}</TableCell>
                            <TableCell>{comment.sellerProduct.product.name ? comment.sellerProduct.product.name : 'Bilinmiyor'}</TableCell>
                            <TableCell>{comment.sellerProduct.product.price }</TableCell>
                            <TableCell>{comment.ApprovalStatus.status_name}</TableCell>
                            <TableCell>
                              <IconButton onClick={(event) => handleMenuOpen(event, comment.comment_id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
                  <Typography variant="h6">Onaylanan Yorumlar</Typography>
                  {approvedComments.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Yorum ID</TableCell>
                            <TableCell>Yorum</TableCell>
                            <TableCell>Puan</TableCell>
                            <TableCell>Kullanıcı</TableCell>
                            <TableCell>Kullanıcı Mail</TableCell>
                            <TableCell>Ürün</TableCell>
                            <TableCell>Ürün Fiyatı</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approvedComments.map((comment) => (
                            <TableRow key={comment.comment_id}>
                              <TableCell>{comment.comment_id}</TableCell>
                              <TableCell>{comment.comment}</TableCell>
                              <TableCell>{comment.rating}</TableCell>
                              <TableCell>{comment.user ? `${comment.user.name} ${comment.user.surname}` : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.user ? comment.user.email : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.sellerProduct.product.name ? comment.sellerProduct.product.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.sellerProduct.product.price ? comment.sellerProduct.product.price : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz onaylanan bir yorum yok.</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Reddedilen Yorumlar</Typography>
                  {rejectedComments.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Yorum ID</TableCell>
                            <TableCell>Yorum</TableCell>
                            <TableCell>Puan</TableCell>
                            <TableCell>Kullanıcı</TableCell>
                            <TableCell>Kullanıcı Mail</TableCell>
                            <TableCell>Ürün</TableCell>
                            <TableCell>Ürün Fiyatı</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rejectedComments.map((comment) => (
                            <TableRow key={comment.comment_id}>
                              <TableCell>{comment.comment_id}</TableCell>
                              <TableCell>{comment.comment}</TableCell>
                              <TableCell>{comment.rating}</TableCell>
                              <TableCell>{comment.user ? `${comment.user.name} ${comment.user.surname}` : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.user ? comment.user.email : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.sellerProduct.product.name ? comment.sellerProduct.product.name : 'Bilinmiyor'}</TableCell>
                              <TableCell>{comment.sellerProduct.product.price ? comment.sellerProduct.product.price : 'Bilinmiyor'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Henüz reddedilen bir yorum yok.</Typography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={actionLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default CommentApprove;
