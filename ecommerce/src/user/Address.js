import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  CardActions,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CssBaseline,
  ThemeProvider,
  createTheme, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/UserNavbar';
import api from '../api/api';
import { renderMenuItems } from './RenderMenuItems';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
// Temayı özelleştir
const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082', // Navbar ve butonlar için mor renk
    },
    secondary: {
      main: '#FFD700', // İkincil eylemler ve butonlar için sarı renk
    },
    background: {
      default: '#f4f4f4', // Sayfanın arka plan rengi
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Kart gölgelendirme
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold', // Buton yazı tipi kalınlığı
        },
      },
    },
  },
});
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
const AddressesPage = () => {
  const [selectedItem, setSelectedItem] = useState('addresses');
  const [addresses, setAddresses] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);

  useEffect(() => {
    // API'den adres verilerini al
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error('Adresler alınırken hata oluştu:', error);
    }
  };
  const openDeleteDialog = (addressId) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };
  const openEditDialog = (address) => {
    setAddressToEdit(address);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setAddressToEdit(null);
  };
  const handleDelete = async () => {
    // Silme işlemini gerçekleştirme
    try {
      const response = await api.delete(`/user/addresses/${addressToDelete}`);
      if (response.status === 200) {
        setAddresses(currentAddresses =>
          currentAddresses.filter(address => address.address_id !== addressToDelete)
        );
        // Dialog penceresini kapat
        closeDeleteDialog();
      }
    } catch (error) {
      console.error('Adres silinirken hata oluştu:', error);
      // Dialog penceresini kapat
      closeDeleteDialog();
    }
  };
  const handleEditSubmit = async () => {
    try {
      const response = await api.put(`/user/addresses/${addressToEdit.address_id}`, addressToEdit);
      if (response.status === 200) {
        // Adres listesini güncelleyin veya yeniden fetch edin
        fetchAddresses();
        closeEditDialog();
      }
    } catch (error) {
      console.error('Adres güncellenirken hata oluştu:', error);
      closeEditDialog();
    }
  };


  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={3}>
              <Paper elevation={0} square>
                <List>{renderMenuItems(selectedItem, setSelectedItem)}</List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Adres Bilgilerim
                </Typography>
                <Divider sx={{ my: 2 }} />
                {
                  addresses.length > 0 ? (
                    addresses.map((address, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {address.adres_line} {/* Adres başlığı */}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.street} {/* Sokak ve numara */}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.neighborhood} {/* Mahalle veya semt */}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.city}, {address.state} {address.zipCode} {/* Şehir, eyalet ve posta kodu */}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.country} {/* Ülke */}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => openEditDialog(address)}>
                            Düzenle
                          </Button>
                          <Button size="small" color="secondary" onClick={() => openDeleteDialog(address.address_id)}>
                            Sil
                          </Button>

                        </CardActions>
                      </Card>
                    ))
                  ) : (
                    // Adres yoksa gösterilecek içerik
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Kayıtlı adresiniz bulunamadı
                      </Typography>
                      <IconButton color="primary" aria-label="Yeni adres ekle">
                        <AddIcon />
                      </IconButton>
                      <Typography variant="body2">
                        Siparişleriniz için kullanabileceğiniz adres eklemek için "Yeni Adres Ekle" butonuna tıklayın.
                      </Typography>
                    </Box>
                  )
                }
                <Link to={'/adres-ekle'}>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Yeni Adres Ekle
                  </Button>
                </Link>
              </Paper>
            </Grid>
          </Grid>
          <Dialog
            open={deleteDialogOpen}
            onClose={closeDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Adresi Sil"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteDialog} color="primary">
                İptal
              </Button>
              <Button onClick={handleDelete} color="primary" autoFocus>
                Sil
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={editDialogOpen} onClose={closeEditDialog}>
            <DialogTitle>Adres Düzenle</DialogTitle>
            <DialogContent>
              <form onSubmit={handleEditSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres Satırı"
                      name="adres_line"
                      value={addressToEdit?.adres_line || ''}
                      onChange={e => setAddressToEdit({ ...addressToEdit, adres_line: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Sokak"
                      name="street"
                      value={addressToEdit?.street || ''}
                      onChange={e => setAddressToEdit({ ...addressToEdit, street: e.target.value })}
                    />
                  </Grid>

                  {console.log(addressToEdit)}
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Şehir"
                      name="city"
                      value={addressToEdit?.city || ''}

                      onChange={e => setAddressToEdit({ ...addressToEdit, city: e.target.value })}
                    >
                      {/* Şehir seçim menüsü, şehirler dizi olmalı */}
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
                      value={addressToEdit?.state || ''}
                      onChange={e => setAddressToEdit({ ...addressToEdit, state: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Posta Kodu"
                      name="zipCode"
                      value={addressToEdit?.postal_code || ''}
                      onChange={e => setAddressToEdit({ ...addressToEdit, zipCode: e.target.value })}
                    />
                  </Grid>


                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditDialog}>İptal</Button>
              <Button onClick={handleEditSubmit} type="submit" variant="contained" color="primary">
                Kaydet
              </Button>
            </DialogActions>
          </Dialog>

        </Container>
      </ThemeProvider>
    </>
  );
};

export default AddressesPage;
