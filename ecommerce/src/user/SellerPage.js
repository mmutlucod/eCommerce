import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Typography, Paper, AppBar, Tabs, Tab, CircularProgress, Grid, Avatar } from '@mui/material';
import NavBar from '../components/UserNavbar';
import Footer from '../components/UserFooter';
import api from '../api/api';
import dayjs from 'dayjs';
import ProductCards from '../components/ProductCards';

const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [navigate, setNavigate] = useState(false);


  const calculateTimeOnPlatform = (createdAt) => {
    const now = dayjs();
    const createdDate = dayjs(createdAt);
    const years = now.diff(createdDate, 'year');
    createdDate.add(years, 'year');
    const months = now.diff(createdDate, 'month');
    return { years, months };
  };

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const sellerResponse = await api.get(`user/sellerInfo/${sellerSlug}`);
        setSeller(sellerResponse.data);
      } catch (err) {
        setNavigate(true); // 404 sayfasına yönlendirme için state güncellemesi
        setError('Satıcı bilgileri yüklenirken bir hata oluştu: ' + err.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchSellerInfo();
      setLoading(false);
    };

    fetchData();
  }, [sellerSlug]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (navigate) {
    return <Navigate to="/hata" />;
  }
  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography variant="h6" color="error">Hata: {error}</Typography>;

  const timeOnPlatform = seller ? calculateTimeOnPlatform(seller.createdAt) : { years: 0, months: 0 };

  const renderTimeOnPlatform = () => {
    if (timeOnPlatform.years > 0) {
      return `${timeOnPlatform.years} yıl, ${timeOnPlatform.months} ay`;
    } else {
      return `${timeOnPlatform.months} ay`;
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', my: 5 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 120, height: 120, fontSize: 48, marginRight: 2, bgcolor: '#3f51b5' }}>
              {seller?.username?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{seller?.username}</Typography>
            </Box>
          </Box>
          <AppBar position="static" color="default" sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Tüm Ürünler" />
              <Tab label="Satıcı Bilgileri" />
            </Tabs>
          </AppBar>
          <Box p={3}>
            {tabValue === 0 ? (
              <AllProducts sellerSlug={sellerSlug} />
            ) : (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Satıcı Bilgileri</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>Gönderim Adresi:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{seller?.city}/{seller?.district}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>Eposta adresi:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{seller?.email}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>İletişim:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{seller?.phone}</Typography>
                    </Paper>
                  </Grid>
                  {console.log(seller)}
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>Platformdaki Süresi:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{renderTimeOnPlatform()}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

const AllProducts = ({ sellerSlug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const productsResponse = await api.get(`user/seller-products/${sellerSlug}`);
        setProducts(productsResponse.data);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu: ' + err.message);
      }
      setLoading(false);
    };

    fetchSellerProducts();
  }, [sellerSlug]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography variant="h6" color="error">Hata: {error}</Typography>;

  return (
    <ProductCards products={products} />
  );
};

export default SellerPage;
