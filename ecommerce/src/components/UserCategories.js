import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Box, Typography, Link } from '@mui/material';

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories');
        
        setCategories(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '10px',
      backgroundColor: '#f0f0f0',
    }}>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <Link
            href={`/#${category.name}`}
            sx={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1rem', // Artırılmış yazı tipi boyutu
              padding: '0 8px', // Sağ ve sol padding
              '&:hover': {
                color: '#4B0082',
              }
            }}
          >
            {category.category_name}
          </Link>
          {/* Son kategori dışında divider (dikey çizgi) ekleyelim */}
          {index < categories.length - 1 && (
            <Typography color="gray" sx={{ mx: 1 }}>
              |
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default CategoriesBar;
