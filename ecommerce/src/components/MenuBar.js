import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const menuItems = [
  { name: 'Kuponlar', icon: '🎟️' },
  { name: 'Öne Çıkanlar', icon: '⭐' },
  { name: 'Yurt Dışından', icon: '🌍' },
  { name: 'Kaçmaz Teklifler', icon: '⚡' },
  { name: 'Siparişlerim', icon: '📦' }
];

const MenuBar = () => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      overflowX: 'auto',
      p: theme.spacing(1),
      bgcolor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1]
    }}>
      {menuItems.map((item, index) => (
        <Card key={index} sx={{ minWidth: 100, m: theme.spacing(1), textAlign: 'center', boxShadow: theme.shadows[3] }}>
          <CardActionArea>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: 14 }}>
                {item.icon} {item.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default MenuBar;
