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
  createTheme,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
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
  const [originalUserInfo, setOriginalUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/user/my-account');
        const { name, surname, email, phone } = response.data;
        setUserInfo({
          name,
          surname,
          email,
          phone,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setOriginalUserInfo({ name, surname, email, phone });
      } catch (error) {
        console.error('Profil bilgileri alınırken hata oluştu:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!userInfo.name || !userInfo.surname || !userInfo.email || !userInfo.phone) {
      setAlertMessage('Ad, Soyad, E-Mail ve Telefon alanları boş bırakılamaz.');
      setAlertSeverity('warning');
      setAlertOpen(true);
      return;
    }

    const isUserInfoChanged = Object.keys(originalUserInfo).some(
      (key) => userInfo[key] !== originalUserInfo[key]
    );

    if (!isUserInfoChanged) {
      setAlertMessage('Hiçbir değişiklik yapılmadı.');
      setAlertSeverity('info');
      setAlertOpen(true);
      return;
    }

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
        setAlertMessage('Profil bilgileriniz başarıyla güncellendi.');
        setAlertSeverity('success');
        setAlertOpen(true);
        setOriginalUserInfo({
          name: userInfo.name,
          surname: userInfo.surname,
          email: userInfo.email,
          phone: userInfo.phone,
        });
      } else {
        setAlertMessage(response.data.message || 'Güncelleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Profil güncelleme işlemi sırasında bir hata oluştu:', error);
      setAlertMessage(error.response?.data?.message || 'Profil güncelleme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
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
      <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default UserProfile;
