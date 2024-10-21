import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();


    if (email === 'admin@gmail.com' && password === 'password123') {
      navigate('/view');
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
    }
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
        <h3 className="text-center mb-4">Login</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleLogin}>
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
            Log In
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
