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

function Users() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: ''
  });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcıları çekerken bir hata oluştu:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı silinirken bir hata oluştu:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null); // Düzenleme modundan çıkarken editUser'ı sıfırla
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/admin/create-user', newUser);
      fetchUsers();
      setNewUser({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: ''
      });
      handleCloseDialog();
      handleSnackbarOpen('Kullanıcı başarıyla eklendi.'); // Snackbar mesajı
    } catch (error) {
      console.error('Kullanıcı eklenirken bir hata oluştu:', error);
    }
  };


  const handleEditSubmit = async () => {
    try {
      console.log(editUser)
      await api.put(`/admin/users/${editUser.user_id}`, editUser);
      fetchUsers();
      handleCloseDialog();
      handleSnackbarOpen('Kullanıcı başarıyla güncellendi.'); // Snackbar mesajı
    } catch (error) {
      console.error('Kullanıcı güncellenirken bir hata oluştu:', error);
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
                  Kullanıcı Listesi
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Adı</TableCell>
                        <TableCell>Soyadı</TableCell>
                        <TableCell>E-posta</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Kullanıcı Ekle">
                            <IconButton color="primary" onClick={handleOpenDialog}>
                              <AddCircleIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow
                          key={user.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.surname}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label="edit" onClick={() => handleEdit(user)}>
                              <EditIcon color="primary" />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteUser(user.user_id)}>
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
      <AddEditUserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        newUser={newUser}
        editUser={editUser}
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

function AddEditUserDialog({ open, onClose, handleChange, handleSubmit, handleEditChange, handleEditSubmit, newUser, editUser }) {
  const isEditMode = !!editUser;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Kullanıcıyı Düzenle' : 'Kullanıcı Ekle'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Adı"
          type="text"
          fullWidth
          variant="standard"
          value={isEditMode ? editUser.name : newUser.name}
          onChange={isEditMode ? handleEditChange : handleChange}
        />
        <TextField
          margin="dense"
          name="surname"
          label="Soyadı"
          type="text"
          fullWidth
          variant="standard"
          value={isEditMode ? editUser.surname : newUser.surname}
          onChange={isEditMode ? handleEditChange : handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="E-posta"
          type="email"
          fullWidth
          variant="standard"
          value={isEditMode ? editUser.email : newUser.email}
          onChange={isEditMode ? handleEditChange : handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Telefon"
          type="tel"
          fullWidth
          variant="standard"
          value={isEditMode ? editUser.phone : newUser.phone}
          onChange={isEditMode ? handleEditChange : handleChange}
        />
        {!isEditMode && (
          <TextField
            margin="dense"
            name="password"
            label="Şifre"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={handleChange}
          />
        )}
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

export default Users;
