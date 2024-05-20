import React, { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SimpleImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const defaultImage = 'default.jpg'; // Varsayılan resim dosya adı

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Sonraki resme geç
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Önceki resme geç
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index); // Küçük resme tıklanıldığında o resme geç
  };

  // Resim URL'lerini API'dan gelen yapıya göre düzenleyin
  const imageUrl = images.length > 0
    ? `http://localhost:5000/img/${images[currentIndex]}`
    : `http://localhost:5000/img/empty.jpg`;

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginX: 8 }}>
      <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {images.length > 0 && (
          <IconButton
            onClick={handlePrev}
            color="primary"
            sx={{
              position: 'absolute',
              marginLeft: -70,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        <img
          src={imageUrl}
          alt={`Slide ${currentIndex + 1}`}
          style={{
            width: '100%',
            maxHeight: '300px', // Büyük resmi daha küçük yap
            minHeight: '300px', // Minimum yüksekliği belirleyerek kartın yüksekliğini sabit tut
            objectFit: 'contain'
          }}
        />
        {images.length > 0 && (
          <IconButton
            onClick={handleNext}
            color="primary"
            sx={{
              position: 'absolute',
              marginRight: -70,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
      {images.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(4) }}>
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                cursor: 'pointer',
                border: 'none',
                marginX: 0,
                '&:not(:last-child)': {
                  marginRight: theme.spacing(1)
                }
              }}
            >
              <img
                src={`http://localhost:5000/img/${image}`}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SimpleImageSlider;
