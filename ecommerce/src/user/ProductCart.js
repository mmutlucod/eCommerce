import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import api from '../api/api'; // api.js dosyanız varsayılan adıyla.

const ProductCard = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get('user/product');
        setProduct(response.data);
      } catch (err) {
        setHata(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (hata) return <div>Hata: {hata}</div>;

  return (
    product && (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="194"
          image={product.imageUrl}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary">
            {product.price} TL
          </Typography>
          {product.discountPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {product.originalPrice} TL
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <Typography variant="body2">
              {product.rating} Yıldız
            </Typography>
            <Typography variant="body2">
              {product.numberOfReviews} Değerlendirme
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small">Sepete Ekle</Button>
        </CardActions>
      </Card>
    )
  );
};

export default ProductCard;
