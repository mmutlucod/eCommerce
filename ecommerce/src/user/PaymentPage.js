import React from 'react';
import { Container, Paper, Grid, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

function PaymentPage() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Adres Bilgileri</Typography>
            <TextField
              label="Adres"
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Button variant="contained" color="primary" style={{ marginBottom: 20 }}>Yeni Adres Ekle</Button>
            <Typography variant="h6">Teslimat Adresi</Typography>
            <FormControlLabel
              control={<Checkbox checked={true} />}
              label="Faturamı aynı adrese gönder"
              style={{ marginBottom: 20 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Ödeme Seçenekleri</Typography>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Ödeme Yöntemi</InputLabel>
              <Select defaultValue="">
                <MenuItem value="banka">Banka/Kredi Kartı</MenuItem>
                <MenuItem value="kredi">Kredi</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6" style={{ marginTop: 20 }}>Sipariş Özeti</Typography>
            <Typography>
              Ürünlerin Toplamı: 4,854.44 TL
            </Typography>
            <Typography>
              Kargo: 34.99 TL
            </Typography>
            <Typography>
              İndirim: -34.99 TL
            </Typography>
            <Typography variant="subtitle1" style={{ marginTop: 10 }}>
              Toplam: 4,802.02 TL
            </Typography>
            <Button variant="contained" color="primary" style={{ marginTop: 20 }}>Kaydet ve Devam Et</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PaymentPage;
