import React, { useState } from 'react';
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
  FormControlLabel
} from '@mui/material';
import Navbar from '../components/UserNavbar'; 
import { renderMenuItems } from './RenderMenuItems'

const UserProfile = () => {
  const [selectedItem, setSelectedItem] = useState('profile'); // Başlangıç değeri olarak bir id kullanın

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Box sx={{ width: '200px', mr: 2 }}>
          <Paper elevation={0} square>
            <List>
            {renderMenuItems(selectedItem, setSelectedItem)}
            </List>
          </Paper>
        </Box>
        <Box flex={1} sx={{ maxWidth: '750px', mx: 4 }}>
          {/* Kullanıcı bilgileri ve diğer içerikler burada yer alacak */}     <Box flex={1} sx={{ maxWidth: '750px' }}>
          <Paper sx={{ p: 3 }}>
            {/* Kullanıcı bilgileri formu */}
            <Typography variant="h6" gutterBottom>
              Kullanıcı Bilgilerim
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Ad" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Soyad" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="E-Mail" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Cep Telefonu" fullWidth />
              </Grid>
              {/* Diğer form alanları buraya eklenecek */}
            </Grid>

            {/* Şifre güncelleme formu */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Şifre Güncelleme
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Şu Anki Şifre" type="password" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Yeni Şifre" type="password" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Yeni Şifre (Tekrar)" type="password" fullWidth />
              </Grid>
            </Grid>

            {/* İki adımlı doğrulama */}
            <FormControlLabel
              control={<Switch name="twoFactorAuth" />}
              label="İki adımlı doğrulama"
              sx={{ mt: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" color="primary">
                Güncelle
              </Button>
            </Box>
          </Paper>
        </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;

