import React from 'react';
import { AppBar, Toolbar, Button, IconButton, InputBase, Grid, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext'; // `useAuth` hook'unu import edin

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const AdminNavbar = () => {
  const { token, logoutAdmin } = useAuth(); // `useAuth` hook'unu kullanarak giriş yapma durumunu ve çıkış fonksiyonunu alın

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#3a3a3a' }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs>
           
          </Grid>
         
          <Grid item xs display="flex" justifyContent="flex-end">
          <Button color="inherit" onClick={logoutAdmin}>Çıkış</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
