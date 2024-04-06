import React from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Typography,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const UserProfile = () => {
  // State ve fonksiyonlar burada tanımlanacak

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sol panel */}
      <Box width={250} flexShrink={0}>
        <Paper elevation={0} square>
          <List>
            <ListItem button selected>
              <ListItemIcon>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Mustafa mutlu" />
            </ListItem>
            {/* Diğer menü öğeleri */}
            {/* ... */}
          </List>
        </Paper>
      </Box>

      {/* Sağ panel */}
      <Box flexGrow={1} p={3}>
        <Paper sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          {/* Kullanıcı bilgileri formu */}
          <Typography variant="h6" gutterBottom>
            Kullanıcı Bilgilerim
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="Ad" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Soyad" fullWidth />
            </Grid>
            {/* Diğer alanlar */}
            <Grid item xs={12}>
              <TextField label="E-Mail" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Cep Telefonu" fullWidth />
            </Grid>
          </Grid>

          {/* Şifre güncelleme formu */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Şifre Güncelleme
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Şu Anki Şifre" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Yeni Şifre" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Yeni Şifre (Tekrar)" fullWidth />
            </Grid>
          </Grid>

          {/* İki adımlı doğrulama */}
          <FormControlLabel
            control={<Switch name="twoFactorAuth" />}
            label="İki adımlı doğrulama"
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" color="primary">
              Güncelle
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserProfile;
