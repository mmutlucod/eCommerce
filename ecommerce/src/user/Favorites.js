import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Navbar from '../components/UserNavbar'; // Navbar komponenti
import { renderMenuItems } from './RenderMenuItems'; // Yan menü komponenti
import api from '../api/api'; // API işlemleri için

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
      },
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
const FavoritesPage = () => {
  const [selectedItem, setSelectedItem] = useState('favorites'); // Yan menüde seçili öğe
  const [favorites, setFavorites] = useState([]); // Favori ürünler listesi

  useEffect(() => {
    // API'den favori ürünleri çekme işlemi
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/user/favorites');
        setFavorites(response.data); // Favori ürünlerin state'e atanması
      } catch (error) {
        console.error('Favori ürünler alınırken hata oluştu:', error);
      }
    };

    fetchFavorites();
  }, []);

  // Favori ürünleri kaldırma işlemi
  const handleRemoveFavorite = async (productId) => {
    // API üzerinden favori ürün kaldırma işlemi
    try {
      const response = await api.delete(`/user/favorites/${productId}`);
      if (response.status === 200) {
        setFavorites(favorites.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Ürün favorilerden kaldırılırken hata oluştu:', error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={3}>
          {/* Side menu */}
          <Grid item xs={12} md={3}>
            <Paper elevation={0} square>
              <List>
                {renderMenuItems(selectedItem, setSelectedItem)}
              </List>
            </Paper>
          </Grid>
          {/* Favorite items content */}
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Beğendiklerim
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {favorites.length > 0 ? (
                favorites.map((item, index) => (
                  <Card key={index} sx={{ display: 'flex', marginBottom: 2 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                        {item.title}
                      </Typography>
                      {/* Add other item details you want to show */}
                    </CardContent>
                    <CardActions>
                      <IconButton aria-label="remove from favorites" onClick={() => handleRemoveFavorite(item.id)}>
                        <FavoriteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="subtitle1">Favori ürününüz bulunmamaktadır.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}  

export default FavoritesPage;
