import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Sayfa yönlendirmek için
import { useAuth } from '../context/AuthContext'; // AuthContext'i içe aktar
import api from '../api/api'; // API istekleri için özelleştirilmiş axios örneğini içe aktar
import SellerFooter from '../components/SellerFooter';
function SellerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Sayfa yönlendirmesi için kullanılacak
  const { login } = useAuth(); // login fonksiyonunu AuthContext'ten kullan

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Kullanıcı adı ve şifre ile giriş yapma isteği
      const response = await api.post('seller/login', { username, password });

      if (response.data && response.data.token) {
        login(response.data); // Token'ı sakla
        alert("Giriş başarılı");
        navigate('/seller/dashboard'); // Kullanıcıyı satıcı paneline yönlendir
      } else {
        alert("Giriş başarısız. Geçerli kullanıcı verileri alınamadı.");
      }
    } catch (error) {
      alert(`Giriş hatası: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <>
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '20vh' }}>
        <Typography component="h1" variant="h5" style={{ marginBottom: '20px' }}>
          Satıcı Girişi
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Kullanıcı Adı"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Şifre"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
          >
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Container>
   
    </>
    
  );
}

export default SellerLogin;
