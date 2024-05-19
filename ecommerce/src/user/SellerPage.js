import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, AppBar, Tabs, Tab, CircularProgress } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import api from '../api/api';
import ProductCards from '../components/ProductCards';

const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const sellerResponse = await api.get(`user/sellerInfo/${sellerSlug}`);
        setSeller(sellerResponse.data);
      } catch (err) {
        setError('Satıcı bilgileri yüklenirken bir hata oluştu: ' + err.message);
      }
    };

    const fetchSellerProducts = async () => {
      try {
        const productsResponse = await api.get(`user/seller-products/${sellerSlug}`);
        setProducts(productsResponse.data);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu: ' + err.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchSellerInfo();
      await fetchSellerProducts();
      setLoading(false);
    };

    fetchData();
  }, [sellerSlug]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <>
      <NavBar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', my: 5 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <img src={seller?.logo} alt={seller?.name} style={{ width: 100, height: 100, borderRadius: '50%', marginRight: 16 }} />
            <Box>
              <Typography variant="h5">{seller?.name}</Typography>
              <Typography variant="body2">Takipçi: {seller?.followersCount}</Typography>
              <Typography variant="body2">Ürün: {seller?.productsCount}</Typography>
              <Typography variant="body2">Değerlendirme: {seller?.reviewsCount}</Typography>
            </Box>
          </Box>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Tüm Ürünler" />
              <Tab label="Satıcı Bilgileri" />
            </Tabs>
          </AppBar>
          <Box p={3}>
            {tabValue === 0 && products.length > 0 ? (
            //   <ProductCards products={products} />
            <Typography>No products available.</Typography>
            ) : (
              <Typography>No products available.</Typography>
            )}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6">Satıcı Bilgileri</Typography>
                <Typography variant="body2">Gönderim Adresi: {seller?.address}</Typography>
                <Typography variant="body2">Ortalama Kargolama Süresi: {seller?.shippingTime}</Typography>
                <Typography variant="body2">Soru Cevaplama Süresi: {seller?.responseTime}</Typography>
                <Typography variant="body2">Platformdaki Süresi: {seller?.yearsOnPlatform} yıl</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default SellerPage;
