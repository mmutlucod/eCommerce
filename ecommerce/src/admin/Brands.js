import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import api from '../api/api'; // API iletişimi için axios instance'ınızın yolu

function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/admin/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Markalar çekilirken bir hata oluştu:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Markalar
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Marka ID</TableCell>
              <TableCell>Marka Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Onay Durumu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.brand_id}>
                <TableCell>{brand.brand_id}</TableCell>
                <TableCell>{brand.brand_name}</TableCell>
                <TableCell>{brand.description}</TableCell>
                <TableCell>{brand.approval_status_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Brands;
