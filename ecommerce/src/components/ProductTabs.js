// ProductTabs.js
import React, { useState } from 'react';
import { Tab, Tabs, Box, AppBar, Typography } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ProductTabs({ product, sellers }) {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: '#e0e0e0' }}> {/* Gri renk arka plan */}
        <Tabs 
          value={tabValue} 
          onChange={handleChange} 
          aria-label="product details tabs"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '.MuiTabs-indicator': { // Aktif tab alt çizgisini ayarlayabilirsiniz
              backgroundColor: 'transparent'
            },
            '.Mui-selected': {  // Aktif tab arka planı beyaz
              backgroundColor: '#ffffff', // Beyaz arka plan
              color: '#000', // Siyah yazı rengi
            },
            '.MuiTab-root': { // Tüm tablar için siyah yazı rengi
              color: '#000', // Siyah yazı rengi
            }
          }}
        >
          <Tab label="Ürün Açıklaması" />
          <Tab label={`Değerlendirmeler (${product?.ratingCount || 0})`} />
          <Tab label="Soru & Cevap" />
          <Tab label={`Diğer Satıcılar (${sellers.length})`} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Typography>{product?.description}</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Değerlendirme detayları burada */}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Soru ve cevaplar burada */}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {sellers.map(seller => (
          <Box key={seller.id} sx={{ mt: 2 }}>
            <Typography>{seller.name} - {seller.price} TL</Typography>
          </Box>
        ))}
      </TabPanel>
    </Box>
  );
}

export default ProductTabs;
