import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import api from '../api/api';
import {
    Container,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Card as MuiCard,
    CardContent,
    Radio,
    FormControlLabel,
    Grid,
    Modal,
    Box,
    TextField,
    MenuItem,
    CssBaseline,
    Checkbox,
    Alert,
    AlertTitle
} from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Card from '../components/Card/Card';
import CForm from '../components/Form/Form';

const theme = createTheme({
    palette: {
        primary: {
            main: '#9370DB',
        },
        secondary: {
            main: '#FFA500',
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
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [contractOpen, setContractOpen] = useState(false);
    const [infoAccepted, setInfoAccepted] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const navigate = useNavigate();

    const [state, setState] = useState({
        cardNumber: '',
        cardHolder: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
        isCardFlipped: false
    });

    const [currentFocusedElm, setCurrentFocusedElm] = useState(null);

    const updateStateValues = useCallback((keyName, value) => {
        setState((prevState) => ({
            ...prevState,
            [keyName]: value || ''
        }));
    }, []);

    const validateForm = () => {
        const { cardNumber, cardHolder, cardMonth, cardYear, cardCvv } = state;
        if (cardNumber && cardHolder && cardMonth && cardYear && cardCvv) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    useEffect(() => {
        validateForm();
    }, [state]);

    let formFieldsRefObj = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef(),
        cardCvv: useRef()
    };

    let focusFormFieldByKey = useCallback((key) => {
        formFieldsRefObj[key].current.focus();
    }, []);

    let cardElementsRef = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef()
    };

    let onCardFormInputFocus = (_event, inputName) => {
        const refByName = cardElementsRef[inputName];
        setCurrentFocusedElm(refByName);
    };

    let onCardInputBlur = useCallback(() => {
        setCurrentFocusedElm(null);
    }, []);

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

    const handleNext = () => {
        if (activeStep === steps.length - 1 && !formValid) {
            setAlertMessage('Lütfen eksik alanları doldurunuz.');
        } else {
            setAlertMessage('');
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => setActiveStep(prev => prev - 1);
    const handleRadioChange = event => setSelectedAddress(event.target.value);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const handleContractOpen = () => setContractOpen(true);
    const handleContractClose = () => setContractOpen(false);
    const handleInfoOpen = () => setInfoOpen(true);
    const handleInfoClose = () => setInfoOpen(false);
    const handleInputChange = event => setNewAddress(prev => ({ ...prev, [event.target.name]: event.target.value }));
    const handleTermsChange = event => setTermsAccepted(event.target.checked);
    const handleInfoChange = event => setInfoAccepted(event.target.checked);
    const handleSubmit = async () => {
        if (!formValid || !termsAccepted || !infoAccepted) {
            setAlertMessage('Lütfen tüm alanları doldurun ve koşulları kabul edin.');
            return;
        }

        try {
            const orderData = {
                addressId: selectedAddress,
                // Diğer sipariş detayları burada
            };

            await api.post('/user/create-order', orderData);
            setOrderSuccess(true);
            setShowConfetti(true);

            setAlertMessage('Siparişiniz başarıyla oluşturuldu!');

            setTimeout(() => {
                setShowConfetti(false);
                navigate('/user/orders');
            }, 5000);
        } catch (error) {
            console.error('Error creating order:', error);
            setAlertMessage('Sipariş oluşturulurken bir hata oluştu.');
        }
    };

    const renderPaymentDetails = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, marginTop: 5 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Ödeme Bilgileri</Typography>
                    <CForm
                        cardMonth={state.cardMonth}
                        cardYear={state.cardYear}
                        onUpdateState={updateStateValues}
                        cardNumberRef={formFieldsRefObj.cardNumber}
                        cardHolderRef={formFieldsRefObj.cardHolder}
                        cardDateRef={formFieldsRefObj.cardDate}
                        onCardInputFocus={onCardFormInputFocus}
                        onCardInputBlur={onCardInputBlur}
                        cardCvv={formFieldsRefObj.cardCvv}
                    >
                        <Card
                            cardNumber={state.cardNumber}
                            cardHolder={state.cardHolder}
                            cardMonth={state.cardMonth}
                            cardYear={state.cardYear}
                            cardCvv={state.cardCvv}
                            isCardFlipped={state.isCardFlipped}
                            currentFocusedElm={currentFocusedElm}
                            onCardElementClick={focusFormFieldByKey}
                            cardNumberRef={cardElementsRef.cardNumber}
                            cardHolderRef={cardElementsRef.cardHolder}
                            cardDateRef={cardElementsRef.cardDate}
                        />
                    </CForm>
                    {alertMessage && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity={orderSuccess ? 'success' : 'error'}>{alertMessage}</Alert>
                        </Box>
                    )}
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, marginTop: 5 }}>
                    <Typography variant="h6" gutterBottom>Kullanıcı Sözleşmesi</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={termsAccepted} onChange={handleTermsChange} />}
                        label={
                            <span>
                                Kullanım koşullarını kabul ediyorum (
                                <Typography component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleContractOpen}>
                                    Mesafeli Satış Sözleşmesi
                                </Typography>
                                )
                            </span>
                        }
                    />
                    <FormControlLabel
                        control={<Checkbox checked={infoAccepted} onChange={handleInfoChange} />}
                        label={
                            <span>
                                Ön bilgilendirme koşullarını kabul ediyorum (
                                <Typography component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleInfoOpen}>
                                    Ön Bilgilendirme Koşulları
                                </Typography>
                                )
                            </span>
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!termsAccepted || !infoAccepted || !formValid}
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: '#f27a1a',
                            color: '#fff',
                            padding: '13px 40px',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            marginTop: 2,
                            '&:hover': {
                                bgcolor: '#f27a1a',
                                transform: 'none'
                            }
                        }}
                    >
                        Siparişi Tamamla
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );

    const renderContent = () => {
        if (activeStep === 0) {
            return (
                <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, marginTop: 5, marginX: 'auto', maxWidth: '1200px' }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Adresler</Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <MuiCard variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleModalOpen} sx={{ width: '100%', height: '100%', padding: 2 }}>
                                    Adres Ekle
                                </Button>
                            </MuiCard>
                        </Grid>
                        {addresses.map((address, index) => (
                            <Grid item xs={12} sm={6} md={4} key={address.address_id}>
                                <MuiCard variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <FormControlLabel
                                            value={address.address_id.toString()}
                                            control={<Radio checked={selectedAddress === address.address_id.toString()} onChange={handleRadioChange} />}
                                            label={<Typography variant="h6">{`${address.address_line}, ${address.city}`}</Typography>}
                                            labelPlacement="end"
                                        />
                                        <Typography variant="body2">{`${address.street}, ${address.state}, ${address.postal_code}`}</Typography>
                                    </CardContent>
                                </MuiCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            );
        } else {
            return renderPaymentDetails();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserNavbar />
            <Container maxWidth={false} disableGutters>
                <Box sx={{ width: '100%', bgcolor: theme.palette.primary.main, padding: 0 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', padding: '20px 0' }}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={StepIconComponent}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                {renderContent()}
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    {activeStep !== 0 && (
                        <Grid item>
                            <Button
                                onClick={handleBack}
                                sx={{
                                    bgcolor: '#f27a1a',
                                    color: '#fff',
                                    padding: '13px 40px',
                                    borderRadius: '5px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        bgcolor: '#f27a1a',
                                        transform: 'none'
                                    }
                                }}
                            >
                                <ArrowBackIcon /> Geri
                            </Button>
                        </Grid>
                    )}
                    {activeStep < steps.length - 1 && (
                        <Grid item>
                            <Button
                                onClick={handleNext}
                                sx={{
                                    bgcolor: '#f27a1a',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '13px 40px',
                                    borderRadius: '5px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        bgcolor: '#f27a1a',
                                        transform: 'none'
                                    }
                                }}
                            >
                                İleri <ArrowForwardIcon />
                            </Button>
                        </Grid>
                    )}
                </Grid>
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
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ bgcolor: '#f27a1a', color: '#fff' }}>Adres Ekle</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Button onClick={handleModalClose}>Kapat</Button>
                </Box>
            </Modal>
            <Modal open={contractOpen} onClose={handleContractClose} aria-labelledby="contract-modal-title" aria-describedby="contract-modal-description">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <Typography id="contract-modal-title" variant="h6" component="h2">Mesafeli Satış Sözleşmesi</Typography>
                    <Typography id="contract-modal-description" sx={{ mt: 2 }}>
                        Mesafeli Satış Sözleşmesi maddeleri burada yer alacak...
                    </Typography>
                    <Button onClick={handleContractClose} sx={{ mt: 2 }}>Kapat</Button>
                </Box>
            </Modal>
            <Modal open={infoOpen} onClose={handleInfoClose} aria-labelledby="info-modal-title" aria-describedby="info-modal-description">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <Typography id="info-modal-title" variant="h6" component="h2">Ön Bilgilendirme Koşulları</Typography>
                    <Typography id="info-modal-description" sx={{ mt: 2 }}>
                        Ön Bilgilendirme Koşulları maddeleri burada yer alacak...
                    </Typography>
                    <Button onClick={handleInfoClose} sx={{ mt: 2 }}>Kapat</Button>
                </Box>
            </Modal>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            {orderSuccess && (
                <Modal open={orderSuccess} onClose={() => setOrderSuccess(false)} aria-labelledby="success-modal-title" aria-describedby="success-modal-description">
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, textAlign: 'center' }}>
                        <Alert severity="success">
                            <AlertTitle>Siparişiniz başarıyla oluşturuldu!</AlertTitle>
                        </Alert>
                    </Box>
                </Modal>
            )}
            <UserFooter />
        </ThemeProvider>
    );
};

export default PaymentPage;
