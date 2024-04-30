import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Box, Typography, Link, Paper } from '@mui/material';

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/user/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

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
          <Box
            sx={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/#${category.name}`}
              sx={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '0 8px',
                '&:hover': {
                  color: '#4B0082',
                }
              }}
            >
              {category.category_name}
            </Link>
            {activeCategory === category && (
              <Paper sx={{
                position: 'absolute',
                width: '200px',
                left: '0',
                top: '100%',
                zIndex: '1',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <Typography variant="body2">
                  {category.description || "No description available."}
                </Typography>
              </Paper>
            )}
          </Box>
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
