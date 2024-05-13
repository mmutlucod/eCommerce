import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Container, Stepper, Step, StepLabel, Button, Typography, Card, CardContent, Radio, FormControlLabel, Grid, Modal, Box, TextField, MenuItem, CssBaseline, StepIcon } from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9370DB', // Açık mor renk
    },
    secondary: {
      main: '#FFA500', // Turuncu renk
    },
  },
});


const steps = ['Adresler', 'Ödeme'];
const cities = ["Ankara", "İstanbul", "İzmir", "Antalya"];

const StepIconComponent = props => {
  const { active, completed } = props;

  if (completed) {
    return <CheckCircleIcon />;
  }
  return <Typography>{props.icon}</Typography>;
};

const PaymentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ address_line: '', city: '', state: '', postal_code: '' });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('user/addresses');
        setAddresses(response.data.addresses || []);
        if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0].address_id.toString());
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleRadioChange = event => setSelectedAddress(event.target.value);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleInputChange = event => setNewAddress(prev => ({ ...prev, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/user/create-address', newAddress);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

const renderContent = () => {
  if (activeStep === 0) {
    return (
      <Grid container spacing={2} sx={{marginTop:5}}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleModalOpen} sx={{ width: '100%', padding: 4.7476 }}>
              Adres Ekle
            </Button>
          </Card>
        </Grid>
        {addresses.map(address => (
          <Grid item xs={12} sm={6} md={4} key={address.address_id}>
            <Card variant="outlined">
              <CardContent>
                <FormControlLabel
                  value={address.address_id.toString()}
                  control={<Radio checked={selectedAddress === address.address_id.toString()} onChange={handleRadioChange} />}
                  label={<Typography variant="h6">{`${address.address_line}, ${address.city}`}</Typography>}
                  labelPlacement="end"
                />
                <Typography variant="body2">{`${address.street}, ${address.state}, ${address.postal_code}`}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else {
    return (
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Ödeme Bilgileri</Typography>
      // Insert payment information form or component here
    );
  }
};

  return (
<<<<<<< HEAD
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserNavbar />
      <Container maxWidth="xl" disableGutters>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', bgcolor: theme.palette.primary.main }}>

          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIconComponent}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderContent()}
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mt: 2, bgcolor: theme.palette.secondary.main }}>Geri</Button>
<Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 2, bgcolor: theme.palette.secondary.main }}>{activeStep === steps.length - 1 ? 'Bitir' : 'İleri'}</Button>

      </Container>
      <Modal open={isModalOpen} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2">Yeni Adres Ekle</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Adres Satırı" name="address_line" value={newAddress.address_line} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Şehir" name="city" value={newAddress.city} onChange={handleInputChange}>
                  {cities.map((city, index) => <MenuItem key={index} value={city}>{city}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="İlçe" name="state" value={newAddress.state} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Posta Kodu" name="postal_code" value={newAddress.postal_code} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>Adres Ekle</Button>
              </Grid>
            </Grid>
          </form>
          <Button onClick={handleModalClose}>Kapat</Button>
        </Box>
      </Modal>
      <UserFooter />
    </ThemeProvider>
=======
    <>
      <UserNavbar />
      <ThemeProvider theme={theme}>

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
    </>
>>>>>>> c6dae5bb2455a707dd5175b35873c2fe2ad077ff
  );
};

export default PaymentPage;
