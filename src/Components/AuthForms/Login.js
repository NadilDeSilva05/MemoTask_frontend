import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Link, Alert } from '@mui/material';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful');
        setMessage('Login successful');
        setError(null);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/todos');
      } else {
        console.error('Failed to log in:', data.message);
        setError(data.message);
        setMessage(null);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in. Please try again.');
      setMessage(null);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <div className="login-form animate__animated animate__fadeIn" style={{ backgroundColor: '#dacec3', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom className="animate__animated animate__fadeInDown">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="animate__animated animate__fadeInUp">
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            className="animate__animated animate__fadeInUp delay-1s"
            style={{ marginTop: '10px' }}
          >
            Login
          </Button>
        </form>
        {message && (
          <Alert severity="success" onClose={handleCloseMessage} className="animate__animated animate__fadeInUp delay-1s" style={{ marginTop: '10px' }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={handleCloseError} className="animate__animated animate__fadeInUp delay-1s" style={{ marginTop: '10px' }}>
            {error}
          </Alert>
        )}
        <Typography variant="body1" align="center" style={{ marginTop: '10px' }} className="animate__animated animate__fadeInUp delay-2s">
          Don't have an account yet? <Link href="/register">Register here</Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Login;
