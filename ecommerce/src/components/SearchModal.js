import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import api from '../api/api';
import ExamplePopup from './ExamplePopup';

const SearchResults = ({ query, anchorRef }) => {
    const [results, setResults] = useState([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchResults = async () => {
            if (query && query.length > 2) { // En az 3 karakter girilmişse arama yap
                try {
                    const response = await api.get(`/user/urunAra?search=${query}`);
                    if (response.data && Array.isArray(response.data)) {
                        setResults(response.data); // API'den gelen ürün bilgilerini set et
                    } else {
                        // Yanıt beklenen dizi formatında değilse, boş dizi atayarak hata önle
                        setResults([]);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]); // Hata durumunda sonuçları boşalt
                }
            } else {
                setResults([]); // Eğer 3 karakterden az girildiyse sonuçları temizle
            }
        };

        fetchResults();
    }, [query]); // query değiştiğinde useEffect tetiklenir

    return (
        <ExamplePopup />
    );
};

export default SearchResults;
