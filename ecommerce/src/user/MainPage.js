import React from 'react';
import Navbar from '../components/UserNavbar'; // Navbar bileşenini import edin
import Categories from '../components/UserCategories';
import Footer from '../components/UserFooter';
import { Box} from '@mui/material';
import ProductCart from './ProductCart';
function MainPage() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Box component="main" sx={{ flex: '1' }}>
        <Categories />
        <ProductCart/>
        {/* Burada diğer içerik bileşenleri yer alabilir */}
      </Box>
      
      <Footer />
    </Box>
  );
}

export default MainPage;
