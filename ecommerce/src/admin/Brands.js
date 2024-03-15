import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminNavbar from '../components/AdminNavbar';
import api from '../api/api';
import { green } from '@mui/material/colors';

function Brands() {
  const [brands, setBrands] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [approvalStatuses, setApprovalStatuses] = useState([]);
  const [newBrand, setNewBrand] = useState({
    brand_name: '',
    description: '',
    approval_status_id: ''
  });
  const [editBrand, setEditBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
    fetchApprovalStatuses();
  }, []);

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  const fetchApprovalStatuses = async () => {
    try {
      const response = await api.get('/admin/approvalstatuses');
      setApprovalStatuses(response.data);
    } catch (error) {
      console.error('Onay durumları çekilirken bir hata oluştu:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/admin/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Markaları çekerken bir hata oluştu:', error);
    }
  };

  const deleteBrand = async (id) => {
    try {
      await api.delete(`/admin/brands/${id}`);
      fetchBrands();
      handleSnackbarOpen('Marka başarıyla silindi.');
    } catch (error) {
      console.error('Marka silinirken bir hata oluştu:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditBrand(null); // Düzenleme modundan çıkarken editBrand'ı sıfırla
  };

  const handleEdit = (brand) => {
    setEditBrand(brand);
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setNewBrand({ ...newBrand, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditBrand({ ...editBrand, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/admin/create-brand', newBrand);
      fetchBrands();
      setNewBrand({
        brand_name: '',
        description: '',
        approval_status_id: ''
      });
      handleCloseDialog();
      handleSnackbarOpen('Marka başarıyla eklendi.');
    } catch (error) {
      console.error('Marka eklenirken bir hata oluştu:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/admin/brands/${editBrand.brand_id}`, editBrand);
      fetchBrands();
      handleCloseDialog();
      handleSnackbarOpen('Marka başarıyla güncellendi.');
    } catch (error) {
      console.error('Marka güncellenirken bir hata oluştu:', error);
    }
  };
 
  
    return (
        <>
          <AdminNavbar />
          <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Tooltip title="Marka Ekle">
                  <IconButton color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
                    <AddCircleIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Marka Listesi
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Marka ID</TableCell>
                            <TableCell>Marka Adı</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>Onay Durumu</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {brands.map((brand) => (
                            <TableRow
                              key={brand.brand_id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell>{brand.brand_id}</TableCell>
                              <TableCell>{brand.brand_name}</TableCell>
                              <TableCell>{brand.description}</TableCell>
                              <TableCell>{brand.ApprovalStatus.status_name}</TableCell>
                              <TableCell align="right">
                                <Tooltip title="Düzenle">
                                  <IconButton onClick={() => handleEdit(brand)}>
                                    <EditIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Sil">
                                  <IconButton onClick={() => deleteBrand(brand.brand_id)}>
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>   <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>{editBrand ? 'Markayı Düzenle' : 'Marka Ekle'}</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      name="brand_name"
      label="Marka Adı"
      type="text"
      fullWidth
      variant="outlined"
      value={editBrand ? editBrand.brand_name : newBrand.brand_name}
      onChange={editBrand ? handleEditChange : handleChange}
    />
    <TextField
      margin="dense"
      name="description"
      label="Açıklama"
      type="text"
      fullWidth
      variant="outlined"
      value={editBrand ? editBrand.description : newBrand.description}
      onChange={editBrand ? handleEditChange : handleChange}
    />
    {editBrand && (
      <FormControl fullWidth margin="dense">
        <InputLabel>Onay Durumu</InputLabel>
        <Select
          label="Onay Durumu"
          name="approval_status_id"
          value={editBrand.approval_status_id}
          onChange={handleEditChange}
        >
          {approvalStatuses.map((status) => (
            <MenuItem key={status.approval_status_id} value={status.approval_status_id}>
              {status.status_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>İptal</Button>
    <Button onClick={editBrand ? handleEditSubmit : handleSubmit}>
      {editBrand ? 'Güncelle' : 'Ekle'}
    </Button>
  </DialogActions>
</Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            ContentProps={{
              sx: {
                backgroundColor: green[600], // Customize your snackbar color
              },
            }}
          />
        </>
      );
    }

export default Brands;












//brand.ApprovalStatus.status_name