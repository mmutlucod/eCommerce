import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { Box, Typography, Link, Paper } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [anchorPosition, setAnchorPosition] = useState(null);
  const barRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuCloseTimeout = useRef(null);

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

  const handleMouseEnter = (category, event) => {
    if (menuCloseTimeout.current) {
      clearTimeout(menuCloseTimeout.current);
      menuCloseTimeout.current = null;
    }
    const barRect = barRef.current.getBoundingClientRect();
    setActiveCategory(category);
    fetchSubCategories(category.id);
    setAnchorPosition({
      top: barRect.bottom,
      left: event.currentTarget.getBoundingClientRect().left,
    });
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuCloseTimeout.current = setTimeout(() => {
      setMenuOpen(false);
      setActiveCategory(null);
      setSubCategories([]);
      setAnchorPosition(null);
    }, 200);
  };

  const handleMenuEnter = () => {
    if (menuCloseTimeout.current) {
      clearTimeout(menuCloseTimeout.current);
      menuCloseTimeout.current = null;
    }
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    setMenuOpen(false);
    setTimeout(() => {
      if (menuOpen) {
        setActiveCategory(null);
        setSubCategories([]);
        setAnchorPosition(null);
      }
    }, 10);
  };

  return (
    <Box ref={barRef} sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap', // Kategorilerin satır bazında kalmasını sağlar
      backgroundColor: '#f0f0f0',
      overflowX: 'hidden',
      paddingX: 24,
      '& .category-box': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '55px',
        flex: 1,
        textAlign: 'center',
        margin: 0,
        '&:hover': {
          backgroundColor: 'white',
        },
      },
      '& .category-link': {
        textDecoration: 'none',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'block',
        marginX: 0,
        whiteSpace: 'normal',
        '&:hover': {
          color: '#4B0082',
        }
      },
      '@media (max-width: 600px)': {
        '& .category-box': {
          flex: '0 0 50%', // En küçük ekranlarda yan yana 2 kategori elemanı
        }
      },
      '@media (min-width: 601px) and (max-width: 960px)': {
        '& .category-box': {
          flex: '0 0 33.33%', // Orta boyutlu ekranlarda yan yana 3 kategori elemanı
        }
      },
      '@media (min-width: 961px)': {
        '& .category-box': {
          flex: '0 0 10%', // Büyük ekranlarda yan yana 5 kategori elemanı
        }
      },
    }}>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <Box
            className="category-box"
            onMouseEnter={(event) => handleMouseEnter(category, event)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/kategori/${category.slug}`}
              className="category-link"
            >
              {category.category_name}
            </Link>
          </Box>
          {index < categories.length - 1 && (
            <Typography color="gray" sx={{ mx: 0 }}>
              |
            </Typography>
          )}
          {activeCategory === category && anchorPosition && (
            <Paper
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
              sx={{
                position: 'fixed',
                top: `${anchorPosition.top}px`,
                left: `${anchorPosition.left}px`,
                zIndex: 1000000,
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                minWidth: '150px',
              }}
            >
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {subCategories.map(sub => (
                  <li key={sub.id} style={{ marginBottom: '8px' }} >
                    <Link href={`/kategori/${sub.slug}`} sx={{ textDecoration: 'none', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', padding: '5px', '&:hover': { color: '#ff6600', backgroundColor: 'transparent' } }}>
                      {sub.category_name}
                      <ArrowForwardIosIcon sx={{ fontSize: '16px' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default CategoriesBar;
