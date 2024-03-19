import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';
import { green } from '@mui/material/colors';

import { Alert } from '@mui/material';

function Brands() {
  const [brands, setBrands] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (searchTerm.trim()) {
      searchBrands(searchTerm);
    } else {
      fetchBrands();
    }
  }, [searchTerm]);

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const searchBrands = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(`/seller/searchsellerbrands?search=${searchTerm}`);
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Markalar aranırken bir hata oluştu:', error);
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/seller/brands');
      const brandsWithStatusCheck = response.data.map((brand) => ({
        ...brand,
        ApprovalStatus: brand.ApprovalStatus || { status_name: "Bilinmiyor" }, // Eğer ApprovalStatus yoksa varsayılan bir değer ata
      }));
  
      setBrands(brandsWithStatusCheck);
    } catch (error) {
      console.error('Markaları çekerken bir hata oluştu:', error);
    }
  };
  
  
  const handleOpenAddDialog = () => {
    setBrandToEdit(null);
    setNewBrandName('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (brand) => {
    setBrandToEdit(brand);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (brandToEdit) {
      try {
        await api.put(`/seller/brands/${brandToEdit.brand_id}`, { brand_name: brandToEdit.brand_name });
        handleSnackbarOpen('Marka başarıyla güncellendi.');
      } catch (error) {
        console.error('Marka güncellenirken bir hata oluştu:', error);
      }
    } else {
      try {
        await api.post('/seller/create-seller-brand', { brand_name: newBrandName });
        handleSnackbarOpen('Marka başarıyla eklendi.');
      } catch (error) {
        console.error('Marka eklenirken bir hata oluştu:', error);
      }
    }
    fetchBrands();
    handleCloseDialog();
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
        <Grid item xs={12}>
            {/* Uyarı mesajını burada göster */}
            <Alert 
              severity="warning"
              sx={{
                fontWeight:'bold',
                display: 'flex', // Flex container olarak ayarla
                justifyContent: 'center', // İçeriği yatay olarak ortala
                alignItems: 'center', // İçeriği dikey olarak ortala
                textAlign: 'center' // Metni ortala (eğer metin birden fazla satırsa)
              }}
            >
              Onaylanan ya da Reddedilen işlemler üzerinde işlemler yapamazsınız.
            </Alert>
          </Grid>
         
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Marka Listesi
                </Typography>
                <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell colSpan={4}>
          {/* Arama kutusu ve Ekle butonunu bu hücreye yerleştir */}
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <TextField
                placeholder="Marka ara..."
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Tooltip title="Marka Ekle">
                <IconButton color="primary" onClick={handleOpenAddDialog}>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Marka ID</TableCell>
        <TableCell>Marka Adı</TableCell>
        <TableCell>Onay Durumu</TableCell>
        <TableCell align="right">İşlemler</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {brands.map((brand) => (
        <TableRow key={brand.brand_id}>
          <TableCell>{brand.brand_id}</TableCell>
          <TableCell>{brand.brand_name}</TableCell>
          <TableCell>{brand.ApprovalStatus.status_name}</TableCell>
          <TableCell align="right">
            {brand.ApprovalStatus.status_name !== "Reddedildi" && brand.ApprovalStatus.status_name !== "Onaylandı" ? (
              <Tooltip title="Düzenle">
                <IconButton onClick={() => handleOpenEditDialog(brand)}>
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            ) : null}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{brandToEdit ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="brand_name"
                label="Marka Adı"
                type="text"
                fullWidth
                variant="outlined"
                value={brandToEdit ? brandToEdit.brand_name : newBrandName}
                onChange={(e) => {
                  brandToEdit
                    ? setBrandToEdit({ ...brandToEdit, brand_name: e.target.value })
                    : setNewBrandName(e.target.value);
                }}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>İptal</Button>
              <Button type="submit" color="primary">{brandToEdit ? 'Güncelle' : 'Ekle'}</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          ContentProps={{
            sx: { backgroundColor: green[600] },
          }}
        />
      </Container>
    </>
  );
}

export default Brands;
