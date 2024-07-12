import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuBar = () => {
  return (
    <div style={{ marginTop: '50px' }}> {/* Adjust margin top as needed */}
      <ListGroup variant="flush" style={{ backgroundColor: '#dacec3', height: '100vh', padding: '20px', width: '250px' }}>
        <ListGroup.Item style={{ backgroundColor: '#dacec3' }}>
          <Link to="/todos" style={{ textDecoration: 'none', color: 'black' }}>Todo List</Link>
        </ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#dacec3' }}>
          <Link to="/memoryalbum" style={{ textDecoration: 'none', color: 'black' }}>Memory Album</Link>
        </ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#dacec3' }}>
          <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>Your Profile Details</Link>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default MenuBar;
