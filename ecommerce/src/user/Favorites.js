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
  Paper
} from '@mui/material';
import { renderMenuItems } from './RenderMenuItems';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../components/UserNavbar';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { addItem } from '../redux/cartSlice'; // cartSlice dosyanızın doğru yolunu kullanın
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

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
      const response = await api.post('/user/deleteFavoriteItem', { productId: productId });
      if (response.status === 200) {
        // Favoriler listesinden ürünü çıkar
        setFavorites(prevFavorites => prevFavorites.filter(item => item.product.product_id !== productId));
      }
    } catch (error) {
      console.error('Ürün favorilerden kaldırılırken hata oluştu:', error);
    }
  };

  const handleAddToCart = (product) => {
    const itemData = {
      sellerProductId: product.sellerProducts[0].seller_product_id, // Ürünün benzersiz kimliği
      quantity: 1, // Eklenecek miktar
      sellerProduct: product.sellerProducts[0], // Ürün verisi
      price: product.sellerProducts[0].price // Ürün fiyatı
    };

    dispatch(addItem(itemData));
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
            <Grid item xs={12} md={9}>
              {/* Burada favori ürünler listelenir */}
              <Grid container spacing={2}>
                {favorites.length > 0 ? (
                  favorites.map((product) => {
                    const productImage = product.product.productImages && product.product.productImages.length > 0
                      ? `http://localhost:5000/img/${product.product.productImages[0].image_path}`
                      : 'http://localhost:5000/img/empty.jpg';

                    return (
                      <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card>
                          <Typography gutterBottom component="h4" sx={{ marginY: '12px' }}>
                            {product.product.name}
                          </Typography>
                          <CardActionArea>
                            <Link to={'/urun/' + product.product.slug}>
                              <CardMedia
                                sx={{ objectFit: 'contain' }}
                                component="img"
                                height="140"
                                image={productImage}
                                alt={product.product.name}
                              />
                            </Link>
                            <CardContent>
                              <Typography variant="body2" color="textSecondary" component="p">
                                {/* {product.product.description} */}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <IconButton aria-label="remove from favorites" onClick={() => handleRemoveFavorite(product.product.product_id)}>
                              <FavoriteIcon sx={{ color: 'red' }} />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button size="small" color="primary" onClick={() => handleAddToCart(product.product)}>
                              Sepete Ekle
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography marginLeft={'40%'} marginTop={'15px'} variant="h6">Henüz favori ürününüz yok.</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default FavoritesPage;
