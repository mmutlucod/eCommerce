import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, useMediaQuery } from '@mui/material';
import api from '../api/api';
import ExamplePopup from './ExamplePopup';

const SearchResults = ({ query, width, searchLeftMargin }) => {
    const [results, setResults] = useState([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchResults = async () => {
            if (query && query.length > 2) {
                try {
                    const response = await api.get(`/user/urunAra?search=${query}`);
                    if (response.data && Array.isArray(response.data)) {
                        setResults(response.data);
                    } else {
                        setResults([]);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                }
            } else {
                setResults([]);
            }
        };

        fetchResults();
    }, [query]);

    return results.length > 0 ? <ExamplePopup width={width} searchLeftMargin={searchLeftMargin} results={results} /> : null;
};

export default SearchResults;