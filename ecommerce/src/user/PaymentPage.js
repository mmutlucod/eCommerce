import React, { useState, useEffect } from 'react';
import { Container, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import api from '../api/api';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/user/addresses');
                console.log('API Response:', response.data);  // Veriyi konsola basarak kontrol edin
                // API'nin döndürdüğü veri yapısına bağlı olarak uygun düzeltmeyi yapın
                // Örneğin, response.data bir nesne ise ve adresler 'addresses' anahtarında ise:
                if (Array.isArray(response.data)) {
                    setAddresses(response.data);
                } else if (response.data.addresses && Array.isArray(response.data.addresses)) {
                    setAddresses(response.data.addresses);
                } else {
                    // Eğer dizi dışında bir yapıdaysa, boş bir dizi ayarlayarak hata almamayı sağlayabilirsiniz.
                    setAddresses([]);
                }
            } catch (error) {
                console.error('Adresler yüklenirken bir hata oluştu:', error);
                setAddresses([]);  // Hata durumunda adres listesini boşalt
            }
        };
        fetchAddresses();
    }, []);

    const selectAddress = (address) => {
        console.log('Seçilen Adres:', address);
        setSelectedAddress(address);
        nextStep();
    };

    const nextStep = () => {
        console.log('İleriye gidiliyor, şu anki adım:', step);
        setStep(step + 1);
    };

    const prevStep = () => {
        console.log('Geri gidiliyor, şu anki adım:', step);
        setStep(step - 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form gönderildi, seçilen adres:', selectedAddress);
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
            {step === 1 && (
                <Grid container spacing={2}>
                    {addresses.map((address, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={() => selectAddress(address)}>
                                <CardContent>
                                    <Typography variant="h6" component="div">{address}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            {step === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">Ödeme Bilgileri</Typography>
                        <form onSubmit={handleSubmit}>
                            <Button onClick={prevStep} sx={{ mt: 2 }}>Geri</Button>
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                Siparişi Tamamla
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default MultiStepForm;
