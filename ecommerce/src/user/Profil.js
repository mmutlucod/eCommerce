import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  TextField,
  Button,
  Typography,
  Divider,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import Navbar from '../components/UserNavbar';
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082',
    },
    secondary: {
      main: '#FFD700',
    },
    background: {
      default: '#f4f4f4',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

const UserProfile = () => {
  const [selectedItem, setSelectedItem] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/user/my-account');
        const { name, surname, email, phone } = response.data;
        setUserInfo({ ...userInfo, name, surname, email, phone });
      } catch (error) {
        console.error('Profil bilgileri alınırken hata oluştu:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const data = {
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
        phone: userInfo.phone,
        currentPassword: userInfo.currentPassword,
        newPassword: userInfo.newPassword,
        confirmPassword: userInfo.confirmPassword,
      };

      const response = await api.put('/user/update-account', data);

      if (response.status === 200) {
        const newToken = response.data.token;
        if (newToken) {
          localStorage.setItem('token', newToken);
        }
        alert('Profil bilgileriniz başarıyla güncellendi.');
      } else {
        alert('Güncelleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Profil güncelleme işlemi sırasında bir hata oluştu:', error);
      alert('Profil güncelleme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Paper elevation={0} square>
              <List>{renderMenuItems(selectedItem, setSelectedItem)}</List>
            </Paper>
          </Grid>
          <Box flex={1} sx={{ maxWidth: '750px', mx: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kullanıcı Bilgilerim
              </Typography>
              <Divider sx={{ my: 2 }} />
              {console.log(userInfo)}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Ad" fullWidth name="name" value={userInfo.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Soyad" fullWidth name="surname" value={userInfo.surname} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="E-Mail" fullWidth name="email" value={userInfo.email} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Cep Telefonu" fullWidth name="phone" value={userInfo.phone} onChange={handleChange} />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Şifre Güncelleme
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Şu Anki Şifre" type="password" fullWidth name="currentPassword" value={userInfo.currentPassword} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Yeni Şifre" type="password" fullWidth name="newPassword" value={userInfo.newPassword} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Yeni Şifre (Tekrar)" type="password" fullWidth name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Güncelle
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;
