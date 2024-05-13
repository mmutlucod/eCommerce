import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Tab,
  Tabs,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('login');
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegisterChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowRegisterPassword = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/user/login', loginData);
      console.log('Giriş başarılı:', response.data);
      if (response.data && response.data.token) {
        login(response.data); // Giriş yapınca token'ı sakla ve kullanıcı durumunu güncelle
      }
      navigate('/user/mainpage'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (error) {
      setError(error.response.data.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };


  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/user/register', formData);
      console.log('Kayıt başarılı:', response.data);
      if (response.data && response.data.token) {
        login(response.data); // Kayıt sonrası otomatik giriş yap
      }
      navigate('/user/mainpage'); // Or wherever you want
    } catch (error) {
      setError(error.response.data.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ my: 4 }}>
        <Paper
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 4,
            borderRadius: 2,
            boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.2)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '.MuiTabs-flexContainer': {
                backgroundColor: '#7E57C2', // Tab'ların arka plan rengi
              },
              '.Mui-selected': {
                color: '#fff', // Seçili tab'ın yazı rengi
              },
              '.MuiTab-root': {
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Tab üzerine gelindiğindeki hover efekti
                },
                borderBottom: '1px solid rgba(255, 255, 255, 0.5)', // Tab alt çizgisi
                color: 'rgba(255, 255, 255, 0.7)', // Tab'ların varsayılan yazı rengi
              }
            }}
          >
            <Tab label="Giriş Yap" value="login" />
            <Tab label="Üye Ol" value="register" />
          </Tabs>
          {tabValue === 'login' && (
            <Box
              component="form"
              onSubmit={handleLoginSubmit}
              sx={{ p: 2 }}
            >
              <TextField
                label="E-posta"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Parola"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
              >
                Giriş Yap
              </Button>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}
          {tabValue === 'register' && (
            <Box
              component="form"
              onSubmit={handleRegisterSubmit}
              sx={{ p: 2 }}
            >
              <TextField
                label="E-posta Adresi"
                name="email"
                value={formData.email}
                onChange={handleRegisterChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Parola"
                type={showRegisterPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleRegisterChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRegisterPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Üye Ol
              </Button>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default AuthPage;
