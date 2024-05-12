import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardMedia, Portal } from '@mui/material';
import ReactDOM from 'react-dom';

const ExamplePopup = ({ results }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null); // Popup DOM elemanı için bir ref oluşturuluyor

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1532) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // İlk yükleme için de kontrol et

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                event.target.value = '';
                setIsOpen(false); // Dışarıya tıklandığında popup'ı kapat
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [popupRef]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal((
        <Box
            ref={popupRef}
            sx={{
                position: 'absolute',
                top: 64,
                marginLeft: '6.89%',
                width: '58%',
                backgroundColor: 'white',
                border: '1px solid #4B0082',
                borderBottom: '2px',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                boxShadow: 3,
                p: 2,
                zIndex: 1500,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            {results.map((result, index) => (
                <Card key={index} sx={{ flexDirection: 'column', alignItems: 'center', mb: 1, cursor: 'pointer', width: '15%', height: '200px', marginLeft: '18px' }} onClick={() => window.location.href = `/urun/${result.product.slug}`}>
                    <CardMedia
                        component="img"
                        sx={{ width: 60, height: 60, alignSelf: 'center' }}
                        src={result.product.productImages.length === 0 ?
                            'http://localhost:5000/img/empty.jpg' :
                            'http://localhost:5000/img/' + result.product.productImages[0].image_path}
                        alt={result.name}
                    />
                    <Typography sx={{ textAlign: 'center', fontSize: '12px', mt: '8px' }}>{result.product.Brand.brand_name + ' ' + result.product.name}</Typography>
                </Card>
            ))}
        </Box>
    ), document.body);
};

export default ExamplePopup;
