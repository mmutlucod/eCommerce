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
    ListItem,
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

const QuestionsPage = () => {
    const [selectedItem, setSelectedItem] = useState('questions'); // Yan menüde seçili öğe
    const [questions, setQuestions] = useState([]); // Kullanıcı soruları listesi

    useEffect(() => {
        // API'den kullanıcı sorularını çekme işlemi
        const fetchQuestions = async () => {
            try {
                const response = await api.get('/user/my-questions');
                setQuestions(response.data); // Kullanıcı sorularının state'e atanması
            } catch (error) {
                console.error('Sorular alınırken hata oluştu:', error);
            }
        };

        fetchQuestions();
    }, []);

    // Soruları ürün adına göre gruplama
    const groupedQuestions = questions.reduce((acc, question) => {
        const productName = question.product.name;
        if (!acc[productName]) {
            acc[productName] = [];
        }
        acc[productName].push(question);
        return acc;
    }, {});

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
                            {/* Burada kullanıcı soruları listelenir */}
                            <List sx={{ mb: 2 }}>
                                {Object.keys(groupedQuestions).length > 0 ? (
                                    Object.keys(groupedQuestions).map((productName, index) => (
                                        <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black', mb: 2 }}>
                                                    Ürün Adı:  <Link style={{ textDecoration: 'none' }} to={'/urun/' + groupedQuestions[productName][0].product.slug}>{productName}</Link>
                                                </Typography>
                                                {groupedQuestions[productName].map((question, qIndex) => (
                                                    <Box key={qIndex} sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f27a1a' }}>
                                                            Soru: {question.question}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                                            Sorulduğu Tarih: {new Date(question.date_asked).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                        {question.approval_status_id === 1 ? (
                                                            question.answer ? (
                                                                <Paper elevation={2} sx={{ mt: 2, p: 2, backgroundColor: '#e0f7fa' }}>
                                                                    <Typography variant="body1">
                                                                        Cevap: {question.answer}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                                                        Cevaplandığı Tarih: {new Date(question.date_answered).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                                    </Typography>
                                                                </Paper>
                                                            ) : (
                                                                <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                                                                    Sorunuz cevap bekliyor...
                                                                </Typography>
                                                            )
                                                        ) : (
                                                            <Typography variant="body2" sx={{ mt: 2, color: 'red' }}>
                                                                Moderatör onayı bekliyor...
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Paper>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="h6">Henüz sorunuz yok.</Typography>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        </>
    );
};

export default QuestionsPage;
