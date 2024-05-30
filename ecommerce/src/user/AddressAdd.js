import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  CssBaseline,
  ThemeProvider,
  createTheme, Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Navbar from '../components/UserNavbar';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
// Türkiye şehirler listesi
const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
  "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta",
  "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
  "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
  "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
  "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];
const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082', // Koyu mor
    },
    secondary: {
      main: '#ffc400', // Canlı sarı
    },
    background: {
      default: '#f4f5fd', // Açık gri-mavi
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
      color: '#4B0082',
      marginBottom: '20px',
    },
    body1: {
      fontWeight: 400,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'normal',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '8px',
        },
      },
    },
  },
});

const AddAddressPage = () => {
  const [addressDetails, setAddressDetails] = useState({
    adres_line: '',
    street: '',
    city: '',
    state: '',

    postal_code: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar durumu
  let navigate = useNavigate(); // Sayfa yönlendirme için

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/create-address', addressDetails);
      // İşlem başarılıysa kullanıcıya bildirim göster
      setOpenSnackbar(true);
      // Burada, işlem başarılı olduktan sonra kullanıcıyı yönlendirebilirsiniz
      // Örneğin ana sayfaya dönmek için: navigate('/');
    } catch (error) {
      console.error('Adres eklenirken hata oluştu:', error);
      // Hata yönetimi, hata mesajı gösterimi vs.
    }
  };

  // Snackbar'ı kapatma fonksiyonu
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Yeni Adres Ekle
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adres Satırı"
                    name="adres_line"
                    value={addressDetails.adres_line}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sokak/Cadde"
                    name="street"
                    value={addressDetails.street}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Şehir"
                    name="city"
                    value={addressDetails.city}
                    onChange={handleChange}
                  >
                    {cities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>


                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="İl/İlçe"
                    name="state"
                    value={addressDetails.state}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Posta Kodu"
                    name="postal_code"
                    value={addressDetails.postal_code}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Adres Ekle
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              Adres başarıyla eklendi!
            </MuiAlert>
          </Snackbar>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AddAddressPage;
