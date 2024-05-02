import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import api from '../api/api';

function SearchModal({ query, open, onClose }) {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                try {
                    const response = await api.get(`user/urunAra?search=${query}`);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Search error:', error);
                }
            }
        };
        fetchResults();
    }, [query]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6">Arama Sonuçları</Typography>
                <List>
                    {searchResults.map((item, index) => (
                        <ListItem button key={index}>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
}

export default SearchModal;
