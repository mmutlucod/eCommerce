import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';

const ExamplePopup = ({ results }) => {
    console.log(results[0].product.productImages.length);
    return (
        <Box
            sx={{
                position: 'absolute',
                width: '58%',
                marginTop: '54px',
                left: '105.5px',
                backgroundColor: 'white',
                border: '1px solid #4B0082',
                height: 'auto',
                borderBottom: '2px',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                boxShadow: 3,
                p: 2,
                zIndex: 'tooltip'
            }}
        >
            {results.map((result, index) => (

                <Card key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer' }} onClick={() => window.location.href = `/urun/${result.product.slug}`}>
                    <CardMedia
                        component="img"
                        sx={{ width: 60, height: 60 }}
                        // image={'http://localhost:5000/img/' + result.product.productImages[0].image_path}
                        src={result.product.productImages.length === 0 ?
                            'http://localhost:5000/img/empty.jpg' :
                            'http://localhost:5000/img/' + result.product.productImages[0].image_path}
                        alt={result.name}
                    />
                    <Typography sx={{ ml: 2, fontSize: '12px', mt: '0.2px' }}>{result.product.Brand.brand_name + ' ' + result.product.name}</Typography>
                </Card>
            ))}
        </Box>
    );
};

export default ExamplePopup;
