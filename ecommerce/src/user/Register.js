import React, { useState, useEffect } from 'react';
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
  Alert,
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
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
    setLoginErrors({
      ...loginErrors,
      [event.target.name]: '',
    });
  };

  const handleRegisterChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setRegisterErrors({
      ...registerErrors,
      [event.target.name]: '',
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

  const validateLogin = () => {
    let errors = {};
    if (!loginData.email) {
      errors.email = 'E-posta adresinizi giriniz';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!loginData.password) {
      errors.password = 'Şifrenizi giriniz';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = 'E-posta adresinizi giriniz';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!formData.password) {
      errors.password = 'Şifrenizi giriniz';
    } else if (formData.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!validateLogin()) return;
    try {
      const response = await api.post('/user/login', formData);
      console.log('Giriş başarılı:', response.data);
      if (response.data && response.data.token) {
        login(response.data); // Giriş yapınca token'ı sakla ve kullanıcı durumunu güncelle
      }
      navigate('/'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (error) {
      setError(error.response.data.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (!validateRegister()) return;
    try {
      await api.post('/user/register', formData);
      const response = await api.post('/user/login', formData);
      if (response.data && response.data.token) {
        login(response.data); // Kayıt sonrası otomatik giriş yap
        navigate('/'); // Kayıt başarılıysa ana sayfaya yönlendir
      }
    } catch (error) {
      setError(error.response.data.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };


  // useEffect to automatically close alerts after 5 seconds
  useEffect(() => {
    if (error || loginErrors.email || loginErrors.password || registerErrors.email || registerErrors.password) {
      const timer = setTimeout(() => {
        setError('');
        setLoginErrors({});
        setRegisterErrors({});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, loginErrors, registerErrors]);

  return (
    <>
      <Navbar />
      <Box sx={{ my: 4 }}>
        <Paper
          sx={{
            maxWidth: 600,
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
            textColor="secondary"
            indicatorColor="secondary"
            sx={{
              '.MuiTabs-flexContainer': {
                backgroundColor: '#FF7043', // Tab'ların arka plan rengi
              },
              '.Mui-selected': {
                color: '#fff', // Seçili tab'ın yazı rengi
              },
              '.MuiTab-root': {
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Tab üzerine gelindiğindeki hover efekti
                },
                borderBottom: '1px solid rgba(255, 255, 255, 0.5)', // Tab alt çizgisi
                color: '#fff', // Tab'ların varsayılan yazı rengi
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
              sx={{ p: 4 }}
            >
              {error && !registerErrors.email && !registerErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : loginErrors.email && loginErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginErrors.email}
                </Alert>
              ) : loginErrors.email ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginErrors.email}
                </Alert>
              ) : loginErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginErrors.password}
                </Alert>
              ) : null}

              <TextField
                label="E-posta"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                fullWidth
                error={!!loginErrors.email}
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    color: '#FF7043', // Label rengi
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7043',
                    },
                  },
                }}
              />

              <TextField
                label="Parola"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                fullWidth
                error={!!loginErrors.password}
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    color: '#FF7043', // Label rengi
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7043',
                    },
                  },
                }}
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
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#FF7043',
                  '&:hover': {
                    backgroundColor: '#FF5722', // Hover rengi
                  },
                }}
              >
                Giriş Yap
              </Button>
            </Box>
          )}
          {tabValue === 'register' && (
            <Box
              component="form"
              onSubmit={handleRegisterSubmit}
              sx={{ p: 4 }}
            >
              {error && !loginErrors.email && !loginErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : registerErrors.email && registerErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {registerErrors.email}
                </Alert>
              ) : registerErrors.email ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {registerErrors.email}
                </Alert>
              ) : registerErrors.password ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {registerErrors.password}
                </Alert>
              ) : null}

              <TextField
                label="E-posta"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleRegisterChange}
                fullWidth
                error={!!registerErrors.email}
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    color: '#FF7043', // Label rengi
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7043',
                    },
                  },
                }}
              />

              <TextField
                label="Parola"
                type={showRegisterPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleRegisterChange}
                fullWidth
                error={!!registerErrors.password}
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    color: '#FF7043', // Label rengi
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7043',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7043',
                    },
                  },
                }}
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
                sx={{
                  mt: 2,
                  backgroundColor: '#FF7043',
                  '&:hover': {
                    backgroundColor: '#FF5722', // Hover rengi
                  },
                }}
              >
                Üye Ol
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default AuthPage;
