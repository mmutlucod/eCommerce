import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Box, Typography, Link, Paper } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';  // Material UI'dan ikon import edildi

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

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

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await api.get(`/user/categories/${categoryId}`);
      setSubCategories(response.data);
    } catch (error) {
      console.error("An error occurred while fetching subcategories:", error);
      setSubCategories([]);  // Clear subcategories on error
    }
  };

  const handleMouseEnter = (category) => {
    setActiveCategory(category);
    fetchSubCategories(category.id);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setSubCategories([]);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '10px',
      backgroundColor: '#f9f9f9',  // Daha açık bir gri renk
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
                fontSize: '1.1rem',  // Yazı boyutu arttırıldı
                padding: '0 8px',
                '&:hover': {
                  color: '#4B0082',  // Renk değişikliği üzerine gelince
                }
              }}
            >
              {category.category_name}
            </Link>
            {activeCategory === category && (
              <Paper sx={{
                position: 'absolute',
                width: '150px',
                left: '0',
                top: '100%',
                zIndex: '1',
                padding: '5px',
                backgroundColor: '#f0f0f0',  
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {subCategories.map(sub => (
                    <li key={sub.id} style={{ marginBottom: '12px', textAlign: 'left' }}>  
                      <Link href={`/#${sub.name}`} sx={{ textDecoration: 'none', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {sub.category_name}
                        <ArrowForwardIosIcon sx={{ fontSize: '16px' }} /> 
                      </Link>
                    </li>
                  ))}
                </ul>
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