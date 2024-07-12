// Registration.js

import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Link, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import 'animate.css'; // Import animate.css for animations
import'./Registration.css';
const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    contact: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User registered successfully');
        // Redirect or show success message
      } else {
        console.error('Failed to register user');
        // Handle error
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
  };

  return (
    <Container maxWidth="sm">
      <div className="registration-form animate__animated animate__fadeIn">
        <Typography variant="h4" gutterBottom className="animate__animated animate__fadeInDown">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className="animate__animated animate__fadeInUp">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Full Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="contact"
                label="Contact Number"
                type="tel"
                variant="outlined"
                fullWidth
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            className="animate__animated animate__fadeInUp delay-1s"
          >
            Register
          </Button>
        </form>
        <Typography variant="body1" align="center" style={{ marginTop: '10px' }} className="animate__animated animate__fadeInUp delay-2s">
          Already have an account? <Link href="/login">Login here</Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Registration;
