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
  const [menuOpen, setMenuOpen] = useState(false); // Menü açılış durumunu izlemek için state ekledik
  const menuCloseTimeout = useRef(null); // Menü kapanma zamanlayıcısı için ref ekledik

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
    setMenuOpen(true); // Menü açıldı
  };

  const handleMouseLeave = () => {
    menuCloseTimeout.current = setTimeout(() => {
      setMenuOpen(false);
      setActiveCategory(null);
      setSubCategories([]);
      setAnchorPosition(null);
    }, 200); // 200ms gecikme ile menüyü kapat, bu süre içinde mouse tekrar menüye girerse kapanmaz
  };

  const handleMenuEnter = () => {
    if (menuCloseTimeout.current) {
      clearTimeout(menuCloseTimeout.current);
      menuCloseTimeout.current = null;
    }
    setMenuOpen(true); // Menü üzerinde dururken kapanmamasını sağlar
  };

  const handleMenuLeave = () => {
    setMenuOpen(false); // Menüden ayrılınca kapanmasını sağlar
    setTimeout(() => {
      if (menuOpen) {
        setActiveCategory(null);
        setSubCategories([]);
        setAnchorPosition(null);
      }
    }, 10); // 200ms gecikme ile menüyü kapat, bu süre içinde mouse tekrar menüye girerse kapanmaz
  };

  return (
    <Box ref={barRef} sx={{
      display: 'flex',
      justifyContent: 'space-around', // Sağdan ve soldan eşit boşluk sağlar
      alignItems: 'center',
      flexWrap: 'nowrap', // Kategorilerin tek satırda kalmasını sağlar
      backgroundColor: '#f0f0f0',
      overflowX: 'hidden', // İçeriğin taşmasını engeller
      whiteSpace: 'nowrap', // Öğelerin alt satıra geçmesini engeller
      paddingX: 24
    }}>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '55px',
              flex: 1,
              textAlign: 'center',
              margin: 0,
              backgroundColor: activeCategory === category && menuOpen ? 'white' : 'transparent', // Açılır menü açıksa beyaz yap
              '&:hover': {
                backgroundColor: 'white', // Fareyle üzerine gelindiğinde arka planı beyaz yapar
              },
            }}
            onMouseEnter={(event) => handleMouseEnter(category, event)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/kategori/${category.slug}`}
              sx={{
                textDecoration: 'none',
                color: activeCategory === category && menuOpen ? '#4B0082' : '#333', // Açılır menü açıksa beyaz yap
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'block',
                marginX: 0,
                whiteSpace: 'normal', // Allow text to wrap to next line
                '&:hover': {
                  color: '#4B0082',
                }
              }}
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
              onMouseEnter={handleMenuEnter} // Alt menünün üzerine gelindiğinde menünün kapanmasını engeller
              onMouseLeave={handleMenuLeave} // Alt menüden ayrılınca menüyü kapatır
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
