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
  CardActions,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/UserNavbar';
import { renderMenuItems } from './RenderMenuItems';
import api from '../api/api';

const AddressesPage = () => {
    const [selectedItem, setSelectedItem] = useState('addresses');
    const [addresses, setAddresses] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
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
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Adres Bilgilerim
              </Typography>
              <Divider sx={{ my: 2 }} />
              {console.log(addresses)}
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
          <Button size="small" color="primary">
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
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Yeni Adres Ekle
              </Button>
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
      </Container>
    </>
  );
};

export default AddressesPage;
