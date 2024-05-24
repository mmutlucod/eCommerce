import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(/404efsane.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Böyle bir sayfamız yok ama benzersiz fırsatlar burada!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Sayfa kaldırılmış veya değiştirilmiş olabilir. Başka bir şey aramak ister misiniz?
        </Typography>
        <Link
          href="/"
          onClick={handleGoHome}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <HomeIcon sx={{ mr: 1 }} />
          Anasayfaya git
        </Link>
        <Typography variant="h1" sx={{ color: 'orange', fontSize: '5rem', fontWeight: 'bold', mt: 4 }}>
          404
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
