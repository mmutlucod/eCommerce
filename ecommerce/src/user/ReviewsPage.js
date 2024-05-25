import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Container,
    List,
    Paper,
    Rating
} from '@mui/material';
import { renderMenuItems } from './RenderMenuItems';
import Navbar from '../components/UserNavbar';
import api from '../api/api';
import { Link } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4B0082', // Navbar ve butonlar için mor renk
        },
        secondary: {
            main: '#FFD700', // İkincil eylemler ve butonlar için sarı renk
        },
        background: {
            default: '#f4f4f4', // Sayfanın arka plan rengi
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Kart gölgelendirme
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold', // Buton yazı tipi kalınlığı
                },
            },
        },
    },
});

const ReviewsPage = () => {
    const [selectedItem, setSelectedItem] = useState('reviews'); // Yan menüde seçili öğe
    const [reviews, setReviews] = useState([]); // Kullanıcı yorumları listesi
    const [loading, setLoading] = useState(true); // Yükleniyor durumu

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/user/my-product-comments');
                setReviews(response.data); // Kullanıcı yorumlarının state'e atanması
                setLoading(false); // Yükleniyor durumu kapatılır
            } catch (error) {
                console.error('Yorumlar alınırken hata oluştu:', error);
                setLoading(false); // Yükleniyor durumu kapatılır hata durumunda da
            }
        };

        fetchReviews();
    }, []);

    return (
        <>
            <Navbar />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={3}>
                            <Paper elevation={0} square>
                                <List>{renderMenuItems(selectedItem, setSelectedItem)}</List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            {loading ? (
                                <Typography align="center" variant="h6">Yükleniyor...</Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <Grid item key={review.id} xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography gutterBottom variant="h6" component="div" marginLeft={'30%'}>
                                                                Ürün Adı: <Link to={'/urun/' + review.sellerProduct.product.slug} style={{ textDecoration: 'none', fontWeight: 'bold' }}>{review.sellerProduct.product.name}</Link>
                                                            </Typography>
                                                            <Typography variant="body2" component="p" sx={{ fontWeight: 'bold', color: getApprovalColor(review.approval_status_id) }}>
                                                                {getApprovalText(review.approval_status_id)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            {review.comment}
                                                        </Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            <Rating value={review.rating} readOnly />
                                                        </Box>
                                                        <Typography variant="body2" color="textSecondary" component="p" sx={{ mt: 1 }}>
                                                            Tarih: {new Date(review.comment_date).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography align="center" variant="h6">Henüz yorumunuz yok.</Typography>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        </>
    );
};

const getApprovalText = (approvalStatusId) => {
    switch (approvalStatusId) {
        case 1:
            return 'Onaylandı';
        case 2:
            return 'Moderatör tarafından reddedildi.';
        default:
            return 'Moderatör onayı bekleniyor.';
    }
};

const getApprovalColor = (approvalStatusId) => {
    switch (approvalStatusId) {
        case 1:
            return 'green';
        case 2:
            return 'red';
        default:
            return 'gray';
    }
};

export default ReviewsPage;
