import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check if the user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.find(user => user.email === email);

    if (userExists) {
      setErrorMessage('User already exists');
      return;
    }

    // Add new user to the local storage
    const newUser = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    navigate('/login'); // Redirect to login after successful registration
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ background: '#FF9500', height: '100vh' }}
    >
      <Card style={{ width: '400px', padding: '20px', borderRadius: '10px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Register</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ background: '#FF9500', borderColor: '#FF9500' }}
          >
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
