import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from '../src/Components/Home/Home';
import Navbar from '../src/Components/Layout/Navbar';
import Login from '../src/Components/AuthForms/Login';
import Registration from '../src/Components/AuthForms/Registration';
import Footer from '../src/Components/Layout/Footer';
import TodoList from '../src/Components/Todo/TodoList';
import MemoryAlbum from '../src/Components/MemoryAlbum/MemoryAlbum'; // Import MemoryAlbum component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div style={{ marginTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/todos" element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />} />
            <Route path="/memoryalbum" element={isAuthenticated ? <MemoryAlbum /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
