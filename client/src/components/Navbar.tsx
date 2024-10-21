import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#6200ea',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ffffff' }}
          >
            Painel de Faturas
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ color: '#ffffff' }}>
            Painel
          </Button>
          <Button color="inherit" component={Link} to="/invoices" sx={{ color: '#ffffff' }}>
            Faturas
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
