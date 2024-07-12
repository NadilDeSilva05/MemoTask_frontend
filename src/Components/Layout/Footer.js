import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <footer style={{
      position: 'fixed', // Keeps the footer fixed at the bottom of the viewport
      left: 0,
      bottom: 0,
      width: '100%',
      padding: '10px 0',
      textAlign: 'center',
      background: 'transparent', // Make the background transparent
      zIndex: 1000, // Ensure footer stays above other content
    }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 Social Media App. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
