import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import './Home.css'; // Import your CSS file for additional styling
import 'animate.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGetStarted = () => {
    // Navigate to the Login page
    navigate('/login');
  };

  return (
    <div className="home-page">
      <Container maxWidth="lg" className="home-container">
        <div className="home-content">
          <div className="white-box animate__animated animate__fadeInLeft">
            <Typography variant="h2" gutterBottom>
              Welcome to ConnectMe
            </Typography>
            <Typography variant="h5" paragraph>
              Connect with friends and the world around you.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGetStarted}
              className="animate__animated animate__fadeInUp delay-1s"
            >
              Get Started
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
