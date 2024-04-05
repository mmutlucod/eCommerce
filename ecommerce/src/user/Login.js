import React, { useState } from 'react';
import { Button, TextField, Typography, Card, CardContent, CardActions, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // AuthContext'i içe aktar
import api from '../api/api'; // API yapılandırmanızı içe aktar

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // useAuth hook'unu kullan

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/user/login', { username, password });
      login(data);
    } catch (err) {
      setError(err.response.data.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  return (
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
              label="Kullanıcı Adı"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
  );
}

export default LoginForm;
