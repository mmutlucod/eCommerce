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

  // Resim URL'lerini API'dan gelen yapıya göre düzenleyin
  const imageUrl = `http://localhost:5000/img/${images[currentIndex]}`;

  return (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconButton
        onClick={handlePrev}
        color="primary"
        sx={{
          position: 'absolute',
          left: theme.spacing(2),
          zIndex: 1
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <img src={imageUrl} alt={`Slide ${currentIndex + 1}`} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
      <IconButton
        onClick={handleNext}
        color="primary"
        sx={{
          position: 'absolute',
          right: theme.spacing(2),
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
