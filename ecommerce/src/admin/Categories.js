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
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminNavbar from '../components/AdminNavbar';
import api from '../api/api';
import { green } from '@mui/material/colors';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategorileri çekerken bir hata oluştu:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Kategori silinirken bir hata oluştu:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null); // Düzenleme modundan çıkarken editCategory'yi sıfırla
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditCategory(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await api.post('/admin/categories', { name: newCategory });
      fetchCategories();
      setNewCategory('');
      handleCloseDialog();
      handleSnackbarOpen('Kategori başarıyla eklendi.'); // Snackbar mesajı
    } catch (error) {
      console.error('Kategori eklenirken bir hata oluştu:', error);
    }
  };


  const handleEditSubmit = async () => {
    try {
      await api.put(`/admin/categories/${editCategory.id}`, { name: editCategory.name });
      fetchCategories();
      handleCloseDialog();
      handleSnackbarOpen('Kategori başarıyla güncellendi.'); // Snackbar mesajı
    } catch (error) {
      console.error('Kategori güncellenirken bir hata oluştu:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kategori Listesi
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        
                        <TableCell> Kategori Adı</TableCell>
                        <TableCell> Kategori Açıklaması</TableCell>
                        <TableCell> Kategori Numarası</TableCell>
                        <TableCell> Kategori Durumu</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Kategori Ekle">
                            <IconButton color="primary" onClick={handleOpenDialog}>
                              <AddCircleIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category, index) => (
                        <TableRow
                          key={category.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        
                          <TableCell>{category.category_name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.id}</TableCell>
                          <TableCell>{category.ApprovalStatus.status_name}</TableCell>

                          <TableCell align="right">
                            <IconButton aria-label="edit" onClick={() => handleEdit(category)}>
                              <EditIcon color="primary" />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteCategory(category.id)}>
                              <DeleteIcon color="secondary" />
                            </IconButton>
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
      </Container>
      <AddEditCategoryDialog
        open={openDialog}
        onClose={handleCloseDialog}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        newCategory={newCategory}
        editCategory={editCategory}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        ContentProps={{
          sx: {
            backgroundColor: green[600],
          }
        }}
        message={snackbarMessage}
      />
    </>
  );
}

function AddEditCategoryDialog({ open, onClose, handleChange, handleSubmit, handleEditChange, handleEditSubmit, newCategory, editCategory }) {
  const isEditMode = !!editCategory;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Kategoriyi Düzenle' : 'Kategori Ekle'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Kategori Adı"
          type="text"
          fullWidth
          variant="standard"
          value={isEditMode ? editCategory.name : newCategory}
          onChange={isEditMode ? handleEditChange : handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={isEditMode ? handleEditSubmit : handleSubmit}>
          {isEditMode ? 'Güncelle' : 'Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Categories;
