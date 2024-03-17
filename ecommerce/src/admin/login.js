import React, { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import api from '../api/api'; // API istekleri için özelleştirilmiş axios örneğini içe aktar
import { useAuth } from '../context/AuthContext'; // AuthContext'i içe aktar

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const { login } = useAuth(); // login fonksiyonunu AuthContext'ten kullan

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username: username,
      password: password,
    };

    try {
      // Özelleştirilmiş axios örneği ile giriş yap
      const response = await api.post('/admin/login', userData);

      if (response.data && response.data.token) { // Token varsa
        login(response.data.token); // Token'ı AuthContext aracılığıyla yönet
        alert("Giriş başarılı");
        navigate('/admin/dashboard'); // Kullanıcıyı admin paneline yönlendir
      } else {
        alert("Giriş başarısız. Geçerli kullanıcı verileri alınamadı.");
      }
    } catch (error) {
      alert(`Giriş hatası: ${error.response ? error.response.data.message : error.message}`);
    }
  };


  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        style={{
          padding: "20px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
        elevation={3}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Üye Girişi
        </Typography>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Kullanıcı Adı"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
