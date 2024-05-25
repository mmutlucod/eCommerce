import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Paper,
  Typography,
  Snackbar,
  CircularProgress,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from './ckeditor5-custom/build/ckeditor';
import SellerNavbar from '../components/SellerNavbar';
import api from '../api/api';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#9c27b0',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#9c27b0',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#9c27b0',
    },
    '&:hover fieldset': {
      borderColor: '#9c27b0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9c27b0',
    },
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#9c27b0',
  color: 'white',
  '&:hover': {
    backgroundColor: '#7b1fa2',
  },
}));

const ProductAdd = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand_id: '',
    description: '',
    stock_code: '',
    category_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsResponse = await api.get('seller/allBrands');
        const categoriesResponse = await api.get('seller/categories');
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setErrorMessage('Veriler yüklenirken bir hata oluştu.');
        console.error('Veriler yüklenirken bir hata oluştu:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({ ...formData, description: data });
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataWithFiles = new FormData();
    for (const key in formData) {
      formDataWithFiles.append(key, formData[key]);
    }
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formDataWithFiles.append('files', selectedFiles[i]);
      }
    }

    try {
      const response = await api.post('/seller/create-product', formDataWithFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Ürün başarıyla oluşturuldu.');
    } catch (error) {
      setErrorMessage('Ürün oluşturulurken bir hata oluştu.');
      console.error('Ürün oluşturulurken bir hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <>
      <SellerNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Yeni Ürün Ekle
          </Typography>
          <form onSubmit={handleSubmit}>
            <CustomTextField
              fullWidth
              margin="normal"
              label="Ürün Adı"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="brand-label">Marka</InputLabel>
              <Select
                labelId="brand-label"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                required
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomTextField
              fullWidth
              margin="normal"
              label="Fiyat"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <CustomTextField
              fullWidth
              margin="normal"
              label="Stok Kodu"
              name="stock_code"
              value={formData.stock_code}
              onChange={handleChange}
              required
            />
            <Box display="flex" alignItems="center" margin="10px">
              <Typography variant="body1" gutterBottom marginLeft={1}>
                Resim seçiniz:
              </Typography>
              <input
                type="file"
                id="file-upload"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" style={{ marginLeft: '20px' }}>
                <Button variant="contained" component="span" color="primary">
                  Dosya Seç
                </Button>
              </label>
              {selectedFiles && (
                <Box marginLeft={2}>
                  <Typography variant="body2" color="textSecondary" component="div">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index}>{file.name}</div>
                    ))}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box margin="normal">
              <Typography variant="body1" gutterBottom>
                Açıklama
              </Typography>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={handleEditorChange}
              />
            </Box>
            <Box display="flex" justifyContent="center" marginTop="20px">
              <CustomButton type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Ürün Ekle'}
              </CustomButton>
            </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductAdd;
