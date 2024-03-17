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
import api from '../api/api'; // Bu yolu projenize göre ayarlayın
import { green } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';


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
      // Arama terimi boşsa tüm markaları tekrar yükle
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
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            {/* Arama kutusu ve Ekle butonu */}
            <TextField
              placeholder="Marka ara..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: 20 }}
            />
            <Tooltip title="Marka Ekle">
              <IconButton color="primary" onClick={handleOpenAddDialog}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
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
        
      
          <Tooltip title="Düzenle">
            <IconButton onClick={() => handleOpenEditDialog(brand)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
        
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
