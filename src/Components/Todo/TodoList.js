import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoList = ({ isAuthenticated }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const todosData = await response.json();
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      setError('Failed to fetch todos. Please try again.');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Task cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: task,
          description: '',
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTask('');
      setError('');
    } catch (error) {
      console.error('Error adding task:', error.message);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const token = localStorage.getItem('token');
      const todoToUpdate = todos.find(todo => todo._id === id);
      const updatedTodo = { ...todoToUpdate, ...updatedFields };

      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodoFromServer = await response.json();
      const updatedTodos = todos.map(todo =>
        todo._id === updatedTodoFromServer._id ? updatedTodoFromServer : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error.message);
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      const deletedTodoFromServer = await response.json();
      const updatedTodos = todos.filter(todo => todo._id !== deletedTodoFromServer._id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      setError('Failed to delete todo. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={12} className="mb-3">
          <h2>Hello, {username}</h2>
        </Col>
        <Col md={4}>
          <Card className="p-3 mb-3" style={{ backgroundColor: '#dacec3' }}>
            <Form onSubmit={addTask}>
              <Form.Group controlId="formTask">
                <Form.Label>Add a task</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
              <Button variant="primary" type="submit" className="mt-2">
                Add
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="p-3" style={{ backgroundColor: '#dacec3' }}>
            <Card.Title as="h3" className="text-center">Todo List</Card.Title>
            <Row className="mt-3">
              {todos.map(todo => (
                <Col md={4} key={todo._id} className="d-flex align-items-stretch">
                  <Card className="mb-3" style={{ width: '100%', backgroundColor: '#dacec3' }}>
                    <Card.Header as="h5">{todo.topic}</Card.Header>
                    <Card.Body>
                      <Form.Group controlId={`formDescription_${todo._id}`}>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={todo.description}
                          onChange={(e) => updateTodo(todo._id, { description: e.target.value })}
                        />
                      </Form.Group>
                      <Button variant="outline-primary" className="mb-2" onClick={() => updateTodo(todo._id, { completed: !todo.completed })}>
                        {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      </Button>
                      <Button variant="outline-danger" className="mb-2" onClick={() => deleteTodo(todo._id)}>
                        Delete
                      </Button>
                      <Card.Text className={`taskText ${todo.completed ? 'completed' : ''}`}>
                        {todo.task}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      Added: {new Date(todo.createdAt).toLocaleString()}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoList;
