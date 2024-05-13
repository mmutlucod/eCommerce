import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Container, Stepper, Step, StepLabel, Button, Typography, Card, CardContent, Radio, FormControlLabel, Grid } from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Özel tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082',  // Mor renk
    },
    secondary: {
      main: '#ffc400',  // Sarı renk
    },
  },
});

const steps = ['Adresler', 'Ödeme'];

const PaymentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('user/addresses');
        if (response.data && Array.isArray(response.data.addresses)) {
          setAddresses(response.data.addresses);
          if (response.data.addresses.length > 0) {
            setSelectedAddress(response.data.addresses[0].address_id.toString());  // Varsayılan olarak ilk adresin ID'sini seç
          }
        } else {
          console.error('Received data is not an array:', response.data);
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRadioChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <UserNavbar />
      <Container maxWidth="lg">
        <Stepper activeStep={activeStep} alternativeLabel sx={{ bgcolor: '#f27a1a', color: 'white' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === 0 && (
            <Grid container spacing={2} style={{ marginTop: 20 }}>
              {addresses.map((address) => (
                <Grid item xs={12} sm={6} md={4} key={address.address_id}>
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel
                        value={address.address_id.toString()}
                        control={<Radio
                          checked={selectedAddress === address.address_id.toString()}
                          onChange={handleRadioChange}
                        />}
                        label={<Typography variant="h6">{`${address.adres_line}, ${address.city}`}</Typography>}
                        labelPlacement="end"
                      />
                      <Typography variant="body2">{`${address.street}, ${address.state}, ${address.postal_code}`}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
        <Button disabled={activeStep === 0} onClick={handleBack}>Geri</Button>
        <Button variant="contained" color="primary" onClick={handleNext}>{activeStep === steps.length - 1 ? 'Bitir' : 'İleri'}</Button>
      </Container>
      <UserFooter />
    </ThemeProvider>
  );
};

export default PaymentPage;
