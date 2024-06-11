import React, { useState } from 'react';
import { Button, TextField, Typography, Card, CardContent, CardActions, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // AuthContext'i içe aktar
import api from '../api/api'; // API yapılandırmanızı içe aktar
import { useNavigate } from 'react-router-dom'; // useHistory hook'unu içe aktar
import Navbar from '../components/UserNavbar';
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // useAuth hook'unu kullan
  const navigate = useNavigate(); // useHistory hook'undan bir örnek al

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/user/login', { email, password });
      login(data); // Kullanıcıyı giriş yapmış olarak işaretle

      // Burada kullanıcı rolüne göre yönlendirme yap
      if (data.role === 'user') {
        navigate('/anasayfa'); // Eğer rol user ise, kullanıcıyı /user/mainpage'e yönlendir
      } else {
        // Diğer roller için farklı yönlendirmeler burada yapılabilir
      }
    } catch (err) {
      setError(err.response.data.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  return (<>
    <Navbar />
    <Container component="main" maxWidth="xs">
      <Card>
        <CardContent>
          <Typography component="h1" variant="h5" gutterBottom>
            Giriş Yap
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="E-posta"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
          </form>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Giriş Yap
          </Button>
        </CardActions>
      </Card>
    </Container>
  </>
  );
}

export default LoginForm;
