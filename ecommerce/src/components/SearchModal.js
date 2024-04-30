import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Button } from '@mui/material';
import axios from 'axios';

function SearchModal({ open, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.yourdomain.com/user/search?q=${searchTerm}`);
            setResults(response.data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Ara"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <Button onClick={handleSearch}>Ara</Button>
                <div>
                    {results.map((item, index) => (
                        <div key={index}>{item.name}</div> // Burada sonuçları nasıl göstermek istediğinize bağlı olarak değişebilir.
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default SearchModal;
