import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SimpleImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Sonraki resme geç
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Önceki resme geç
  };

  const imageUrl = `http://localhost:5000/img/${images[currentIndex]}`; // Resim URL'lerini API'dan gelen yapıya göre düzenleyin

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginX: 8 }}>
      <IconButton
        onClick={handlePrev}
        color="primary"
        sx={{
          position: 'absolute',
          left: 0, // Iconları konteyner dışına çıkarmak için
          transform: 'translateX(-100%)', // Iconları tamamen dışarı çıkar
          zIndex: 1
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <Box sx={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <img src={imageUrl} alt={`Slide ${currentIndex + 1}`} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
      </Box>
      <IconButton
        onClick={handleNext}
        color="primary"
        sx={{
          position: 'absolute',
          right: 0, // Iconları konteyner dışına çıkarmak için
          transform: 'translateX(100%)', // Iconları tamamen dışarı çıkar
          zIndex: 1
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      <Box sx={{ position: 'absolute', bottom: theme.spacing(2), width: '100%', textAlign: 'center' }}>
        <Typography>{currentIndex + 1} / {images.length}</Typography>
      </Box>
    </Box>
  );
};

export default SimpleImageSlider;
