import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import api from '../api/api'; // api dosyanızı import edin

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Basitçe form verilerini doğrulayın
    if (!formData.name || !formData.surname || !formData.email || !formData.phone || !formData.password) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const response = await api.post('user/register', formData);
      console.log(response.data);
      alert('Kayıt başarılı!');
    } catch (error) {
      console.error('Kayıt sırasında hata oluştu:', error);
      alert('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>Kayıt Ol</Typography>
      <TextField label="Ad" name="name" variant="outlined" required onChange={handleChange} />
      <TextField label="Soyad" name="surname" variant="outlined" required onChange={handleChange} />
      <TextField label="E-posta" name="email" type="email" variant="outlined" required onChange={handleChange} />
      <TextField label="Telefon" name="phone" type="tel" variant="outlined" required onChange={handleChange} />
      <TextField label="Parola" name="password" type="password" variant="outlined" required onChange={handleChange} />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Kayıt Ol
      </Button>
    </Box>
  );
};

export default RegisterPage;
