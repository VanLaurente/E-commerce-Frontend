import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const accounts = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password456' },
]; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('admin'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting login...'); // Debug log

    if (role === 'admin' && email === 'admin@gmail.com' && password === 'password123') {
      console.log('Admin login successful'); // Debug log
      navigate('/view'); 
    } else if (role === 'user') {
      const account = accounts.find(acc => acc.email === email && acc.password === password);
      if (account) {
        console.log('User login successful'); // Debug log
        navigate('/frontstore'); 
      } else {
        setErrorMessage('Account does not exist. Please check your email and password.');
      }
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration for demonstration
    alert(`User registered with email: ${email}`);
    setEmail('');
    setPassword('');
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
        <h3 className="text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <div className="mb-3 d-flex justify-content-center">
          <Button
            variant={role === 'admin' ? 'warning' : 'light'}
            onClick={() => { setRole('admin'); setIsRegistering(false); }}
            style={{ marginRight: '10px', backgroundColor: role === 'admin' ? '#FF9500' : 'transparent', color: role === 'admin' ? '#fff' : '#000' }}
          >
            Admin
          </Button>
          <Button
            variant={role === 'user' ? 'warning' : 'light'}
            onClick={() => { setRole('user'); setIsRegistering(false); }}
            style={{ backgroundColor: role === 'user' ? '#FF9500' : 'transparent', color: role === 'user' ? '#fff' : '#000' }}
          >
            User
          </Button>
        </div>

        <Form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
            {isRegistering ? 'Register' : 'Log In'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Log In' : 'Need an account? Register'}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
