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
  Switch,
  FormControlLabel,Container
} from '@mui/material';
import Navbar from '../components/UserNavbar'; 
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api'; // API iletişimi sağlayan modülünüz

const UserProfile = () => {
  const [selectedItem, setSelectedItem] = useState('profile');
  // Kullanıcı bilgileri ve şifre güncellemesi için state tanımlamaları
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
    // Kullanıcı bilgilerini API'den çekme
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/user/my-account');
        // API'den dönen veri yapısına göre ayarlama yapın
        const { name, surname, email, phone } = response.data;
        setUserInfo(userInfo => ({ ...userInfo, name, surname, email, phone }));
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

  // Güncelle butonunun onClick handler'ı
  const handleUpdate = async () => {
    try {
      // API isteği için gerekli veriyi hazırla
      const data = {
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
        phone: userInfo.phone,
      };
  
      // Kullanıcı şifre güncelleme alanlarını doldurmuşsa, bu veriyi de isteğe ekle
    
      // Kullanıcı bilgilerini ve/veya şifreyi güncellemek için API'ye POST isteği gönder
      const response = await api.put('/user/update-account', data);
        console.log(data)
      // Başarılı bir güncelleme sonrası kullanıcıya bilgi ver
      if (response.status === 200) {
        alert('Profil bilgileriniz başarıyla güncellendi.');
        // Gerekirse ek işlemler yapılabilir (örneğin, sayfayı yenilemek, başka bir sayfaya yönlendirmek vs.)
      } else {
        console.log(response.status)
        // API'den beklenmeyen bir yanıt geldiyse, kullanıcıyı bilgilendir
        alert('Güncelleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Profil güncelleme işlemi sırasında bir hata oluştu:', error);
      alert('Profil güncelleme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };
  
  return (
    <>
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
            {/* Kullanıcı bilgileri formu */}
            <Typography variant="h6" gutterBottom>
              Kullanıcı Bilgilerim
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Ad" fullWidth name="firstName" value={userInfo.name} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Soyad" fullWidth name="lastName" value={userInfo.surname} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="E-Mail" fullWidth name="email" value={userInfo.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Cep Telefonu" fullWidth name="phone" value={userInfo.phone} onChange={handleChange} />
              </Grid>
            </Grid>

            {/* Şifre güncelleme formu */}
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

            {/* İki adımlı doğrulama */}
            {/* Bu kısım API'nizde destekleniyorsa güncellenebilir */}
            <FormControlLabel control={<Switch name="twoFactorAuth" />} label="İki adımlı doğrulama" sx={{ mt: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Güncelle
              </Button>
            </Box>
          </Paper>
        </Box>
      </Grid>
      </Container>
    </>
  );
};

export default UserProfile;
