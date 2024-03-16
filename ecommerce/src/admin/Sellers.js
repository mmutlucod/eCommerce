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
} from '@mui/material';
import api from '../api/api'; // API iletişimi için axios instance'ınızın yolu

function Sellers() {
  const [sellers, setSellers] = useState([]);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Satıcılar
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
             
              <TableCell>Unvan</TableCell>
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>Kep Adresi</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Şirket Türü</TableCell>
              <TableCell>Vergi Numarası</TableCell>
              <TableCell>Lokasyon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
               
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.username}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.phone}</TableCell>
                <TableCell>{seller.corporate_type_id}</TableCell>
                <TableCell>{seller.tax_identity_number}</TableCell>
                <TableCell>{seller.district +'/'+ seller.city}</TableCell>
                {/* Diğer satıcı bilgilerini burada listele */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Sellers;
