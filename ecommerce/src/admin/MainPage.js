import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Grid, Card, CardContent, Paper, Toolbar } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Typography } from '@mui/material';
const drawerWidth = 240;

function MainPage() {
  return (
    <Box sx={{ display: 'flex', m: 2 }}>
     
        <AdminNavbar />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginTop: '64px', height: 'calc(100% - 64px)', backgroundColor: '#1565c0' },
          }}
        >
          <List>
              {[{ text: 'Ana Sayfa', icon: <DashboardIcon />, link: '/' }, { text: 'Kullanıcılar', icon: <GroupIcon />, link: '/users' },
               { text: 'Siparişler', icon: <ShoppingCartIcon />, link: '/orders' },
               { text: 'Markalar', icon: <ShoppingCartIcon />, link: '/brands' },
               { text: 'Satıcılar', icon: <ShoppingCartIcon />, link: '/sellers' },
               { text: 'Kategoriler', icon: <ShoppingCartIcon />, link: '/categories' },

              ].map((item, index) => (
                <ListItem button key={item.text} component={Link} to={item.link}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt:-5 }}>
          <Toolbar />
          <Container sx={{ py: 2 }}>
            <Grid container spacing={2}>
              {['Satışlar', 'Ziyaretçiler', 'Siparişler', 'Gelir'].map((statistic) => (
                <Grid item xs={12} sm={6} md={3} key={statistic}>
                  <Card sx={{ minHeight: 120 }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {statistic}
                      </Typography>
                      <Typography variant="body2">
                        Detaylar...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 2, textAlign: 'center'}}>
            <Typography variant="body1">Your Footer Content Here</Typography>
          </Paper>
        </Box>
      
    </Box>
  );
}

export default MainPage;
