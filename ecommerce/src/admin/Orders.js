import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AdminNavbar from '../components/AdminNavbar';
import api from '../api/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0f7fa',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9',
          },
        },
      },
    },
  },
});

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState({}); // This now tracks the seller ID for toggling details

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get('/admin/sellers');
        setSellers(response.data);
      } catch (error) {
        console.error('Satıcılar çekilirken bir hata oluştu:', error);
      }
    };

    fetchSellers();
  }, []);

  const handleToggle = (id) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AdminNavbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Satıcılar
          </Typography>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Unvan</TableCell>
                  <TableCell>Kullanıcı Adı</TableCell>
                  <TableCell>Kep Adresi</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Şirket Türü</TableCell>
                  <TableCell>Vergi Numarası</TableCell>
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>Detaylar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellers.map((seller) => (
                  <React.Fragment key={seller.id}>
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.username}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.phone}</TableCell>
                      <TableCell>{seller.corporate_type_id}</TableCell>
                      <TableCell>{seller.tax_identity_number}</TableCell>
                      <TableCell>{`${seller.district}/${seller.city}`}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggle(seller.id)}
                        >
                          {open[seller.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={open[seller.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Satıcı Detayları
                            </Typography>
                            {/* Burada ekstra satıcı detaylarını göster */}
                            {/* Örneğin: */}
                            <Typography>Detaylı Bilgi: {/* Detaylı bilgiler burada */}</Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default Sellers;
