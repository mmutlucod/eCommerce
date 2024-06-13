import React from 'react';
import { Box, Typography } from '@mui/material';

const SellerFooter = () => {
  return (
    <Box 
      sx={{
        bgcolor: 'black',
        color: 'white',
        py: 2,
        mt: 'auto',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2">
        &copy; Telif Hakkı 2024 noVa
      </Typography>
    </Box>
  );
};

export default SellerFooter;
