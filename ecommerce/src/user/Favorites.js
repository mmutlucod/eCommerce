import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  List,
} from '@mui/material';
import { renderMenuItems } from './RenderMenuItems';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../components/UserNavbar';
import api from '../api/api';

const ProductCard = ({ product, onRemove }) => (
  <Card sx={{ maxWidth: 345, m: 2 }}>
    <CardActionArea>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          {`${product.price} TL`}
        </Typography>
        {/* Add other product details here */}
      </CardContent>
    </CardActionArea>
    <CardActions disableSpacing>
      <IconButton aria-label="remove from favorites" onClick={() => onRemove(product.id)}>
        <CloseIcon />
      </IconButton>
      <Box flexGrow={1} />
      <IconButton aria-label="add to cart">
        <ShoppingCartIcon />
      </IconButton>
    </CardActions>
  </Card>
);
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
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <List component="nav" aria-label="sidebar navigation">
              {renderMenuItems(selectedItem, setSelectedItem)}
            </List>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Beğendiklerim
            </Typography>
            {/* Burada favori ürünler listelenir */}
            <Grid container spacing={2}>
              {favorites.length > 0 ? (
                favorites.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          image={product.imageUrl}
                          alt={product.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {product.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <IconButton aria-label="remove from favorites" onClick={() => handleRemoveFavorite(product.id)}>
                          <FavoriteIcon />
                        </IconButton>
                        <Button size="small" color="primary">
                          Sepete Ekle
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="subtitle1">Henüz favori ürününüz yok.</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default FavoritesPage;
