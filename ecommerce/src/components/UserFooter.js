import React from 'react';
import { Box, Grid, Typography, Link, List, ListItem, Divider, Paper, Avatar, IconButton } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PaymentIcon from '@mui/icons-material/Payment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AppStoreIcon from '@mui/icons-material/Apple'; // Diyelim ki bu Apple App Store için ikon
import GooglePlayIcon from '@mui/icons-material/Android'; // Diyelim ki bu Google Play için ikon


const Footer = () => {
  return (<>
    <Paper elevation={0} square sx={{ padding: '16px', marginBottom: '20px', overflow: 'hidden', marginTop: '200px' }}>
      <Grid container spacing={2} justifyContent="center">
        {/* İndirim İkonu ve Metni */}
        <Grid item>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#4B0082', margin: 'auto', marginBottom: '8px' }}>
              <PercentIcon sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="body1">Her Alışverişte Kupon Fırsatları</Typography>
          </Box>
        </Grid>

        {/* Yıldız İkonu ve Metni */}
        <Grid item>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#4B0082', margin: 'auto', marginBottom: '8px' }}>
              <StarBorderIcon sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="body1">Her Gün Yeni Ürünler ve Fırsatlar</Typography>
          </Box>
        </Grid>

        {/* Ödeme İkonu ve Metni */}
        <Grid item>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#4B0082', margin: 'auto', marginBottom: '8px' }}>
              <PaymentIcon sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="body1">Herkese Uygun Ödeme Yöntemleri</Typography>
          </Box>
        </Grid>

        {/* Değişim İkonu ve Metni */}
        <Grid item>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#4B0082', margin: 'auto', marginBottom: '8px' }}>
              <AutorenewIcon sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="body1">Kolay Değişim ve İade</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>


    <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', color: '#333' }}>
      <Grid container spacing={2}>
        {/* noVa Links */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>noVa</Typography>
          <List>
            <ListItem>Kurumsal</ListItem>
            <ListItem>Marka Koruma Merkezi</ListItem>
            <ListItem>Markalar</ListItem>
            <ListItem>İletişim</ListItem>
          </List>
        </Grid>

        {/* Customer Links */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>Müşteriler</Typography>
          <List>
            <ListItem>Üye Ol</ListItem>
            <ListItem>Yeni Üye Rehberi</ListItem>
            <ListItem>Yardım</ListItem>
            <ListItem>Ödeme Seçenekleri</ListItem>
            {/* ... diğer list items ... */}
          </List>
        </Grid>

        {/* Store Links */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>Mağazalar</Typography>
          <List>
            <ListItem>Mağaza Girişi</ListItem>
            <ListItem>Ücretsiz Mağaza Aç</ListItem>
            <ListItem>Mağaza Puanı Hesaplaması</ListItem>
            {/* ... diğer list items ... */}
          </List>
        </Grid>

        {/* Social Media Links */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>Bizi Takip Et</Typography>
          <Box>
            <IconButton><FacebookIcon /></IconButton>
            <IconButton><TwitterIcon /></IconButton>
            <IconButton><InstagramIcon /></IconButton>
            <IconButton><PinterestIcon /></IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Uygulamayı İndirin</Typography>
          <Box>
            <IconButton><AppStoreIcon /></IconButton>
            <IconButton><GooglePlayIcon /></IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Lower Footer */}
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="body2">
          © Telif Hakkı 2024 noVa
        </Typography>

      </Box>
    </Box>

  </>
  );
};

export default Footer;
