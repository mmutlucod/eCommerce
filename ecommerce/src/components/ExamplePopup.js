import React from 'react';
import { Box, Typography } from '@mui/material';

const ExamplePopup = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                width: '30%', // Pencerenin genişliği
                marginTop: '35px', // Arama kutusundan 2-3 cm aşağı
                left: '35%', // Sol tarafa göre konumlandırma (Bu değeri ayarlayabilirsiniz)
                bgcolor: 'background.paper', // Arka plan rengi
                border: '1px solid #ccc', // Çerçeve
                boxShadow: 3, // Gölge efekti
                p: 2, // İç padding
                zIndex: 'tooltip' // Z-index değeri
            }}
        >
            <Typography variant="h6">Popup İçeriği</Typography>
            <Typography>
                Burası arama sonuçlarınızın veya başka bilgilerin gösterileceği alandır.
                Stilleri ve içeriği projenize göre özelleştirebilirsiniz.
            </Typography>
        </Box>
    );
};

export default ExamplePopup;
