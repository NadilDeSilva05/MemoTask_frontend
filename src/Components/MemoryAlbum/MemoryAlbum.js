import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddAlbumForm = ({ addAlbum }) => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [error, setError] = useState('');

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) {
      setError('Album title cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      const decoded = jwtDecode(token);
      const response = await axios.post('http://localhost:5000/api/albums', {
        title: albumTitle,
        userId: decoded.id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      addAlbum(response.data);
      setAlbumTitle('');
      setError('');
    } catch (err) {
      console.error('Error adding album:', err);
      setError('Failed to add album. Please try again.');
    }
  };

  return (
    <Card className="p-3 mb-3" style={{ backgroundColor: '#dacec3' }}>
      <Form onSubmit={handleAddAlbum}>
        <Form.Group controlId="formAlbum">
          <Form.Label>Add an Album</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter album title"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        <Button variant="primary" type="submit" className="mt-2">
          Add Album
        </Button>
      </Form>
    </Card>
  );
};

const PhotoCard = ({ photo, updateDescription, deletePhoto, albumId }) => {
  const [editableDescription, setEditableDescription] = useState(photo.description);
  const [error, setError] = useState('');

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/albums/${albumId}/photos/${photo._id}`, {
        description: editableDescription,
      });
      updateDescription(photo._id, editableDescription);
    } catch (err) {
      console.error('Error updating description:', err);
      setError('Failed to update description. Please try again.');
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/albums/${albumId}/photos/${photo._id}`);
      deletePhoto(photo._id);
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo. Please try again.');
    }
  };

  return (
    <Card className="mb-3" style={{ width: '100%', backgroundColor: '#dacec3' }}>
      <Card.Body>
        <Image src={photo.url} thumbnail />
        <Form.Control
          type="text"
          placeholder="Edit description"
          value={editableDescription}
          onChange={handleDescriptionChange}
          className="mb-2 mt-2"
        />
        <Button variant="outline-primary" onClick={handleSaveDescription} className="mb-2">
          Save
        </Button>
        <Button variant="danger" onClick={handleDeletePhoto} className="w-100">
          Delete Photo
        </Button>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      </Card.Body>
    </Card>
  );
};

const Album = ({ album, addPhoto, updateDescription, deletePhoto }) => {
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');

  const handleAddPhoto = async (e, albumId) => {
    e.preventDefault();
    if (!photoFile) {
      setError('Photo file cannot be empty.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await axios.post(`http://localhost:5000/api/albums/${albumId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      addPhoto(albumId, response.data.photo);
      setPhotoFile(null);
      setError('');
    } catch (err) {
      console.error('Error adding photo:', err);
      setError('Failed to add photo. Please try again.');
    }
  };

  if (!album || !album.title) {
    return null; // Render nothing if album is not defined
  }

  return (
    <Card className="mb-3" style={{ backgroundColor: '#dacec3' }}>
      <Card.Header as="h5">{album.title}</Card.Header>
      <Card.Body>
        <Form onSubmit={(e) => handleAddPhoto(e, album._id)}>
          <Form.Group controlId="formPhoto">
            <Form.Control
              type="file"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          <Button variant="primary" type="submit" className="mt-2">
            Add Photo
          </Button>
        </Form>
        <Row className="mt-3">
          {album.photos.map((photo) => (
            <Col md={4} key={photo._id} className="d-flex align-items-stretch">
              <PhotoCard
                photo={photo}
                updateDescription={updateDescription}
                deletePhoto={deletePhoto}
                albumId={album._id}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

const MemoryAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        await fetchAlbums(decoded.id);
      }
    };

    fetchUserData();
  }, []);

  const fetchAlbums = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/albums?userId=${userId}`);
      setAlbums(response.data);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  const addAlbum = (newAlbum) => {
    setAlbums([...albums, newAlbum]);
  };

  const addPhoto = (albumId, photo) => {
    const updatedAlbums = albums.map((album) =>
      album._id === albumId ? { ...album, photos: [...album.photos, photo] } : album
    );
    setAlbums(updatedAlbums);
  };

  const updateDescription = (photoId, description) => {
    const updatedAlbums = albums.map((album) => {
      const updatedPhotos = album.photos.map((photo) =>
        photo._id === photoId ? { ...photo, description } : photo
      );
      return { ...album, photos: updatedPhotos };
    });
    setAlbums(updatedAlbums);
  };

  const deletePhoto = (photoId) => {
    const updatedAlbums = albums.map((album) => {
      const updatedPhotos = album.photos.filter((photo) => photo._id !== photoId);
      return { ...album, photos: updatedPhotos };
    });
    setAlbums(updatedAlbums);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={12} className="mb-3">
          <h2>Hello, {username}</h2>
        </Col>
        <Col md={4}>
          <AddAlbumForm addAlbum={addAlbum} />
        </Col>
        <Col md={8}>
          <Card className="p-3" style={{ backgroundColor: '#dacec3' }}>
            <Card.Title as="h3" className="text-center">Memory Album</Card.Title>
            <Row>
              {albums.map((album) => (
                <Col md={12} key={album._id} className="mb-3">
                  <Album
                    album={album}
                    addPhoto={addPhoto}
                    updateDescription={updateDescription}
                    deletePhoto={deletePhoto}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MemoryAlbum;
