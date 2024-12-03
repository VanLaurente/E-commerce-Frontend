import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const FrontStore = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to load products. Please try again.'); // Set error message
      });
  }, []);

  useEffect(() => {
    // Fetch the cart count from the backend
    fetch('http://127.0.0.1:8000/api/cart')
      .then(response => response.json())
      .then(cartItems => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      })
      .catch(error => console.error('Error fetching cart data:', error));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const filteredProducts = products.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (productId) => {
    console.log(`Added product with ID: ${productId} to cart`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Row className="mb-3" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <Col md={2} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '250px', height: 'auto' }} />
        </Col>
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar mb-2"
            style={{
              borderRadius: '25px',
              height: '50px',
              fontSize: '18px',
              border: '2px solid #FF9500',
              marginTop: '50px',
            }}
          />
        </Col>
        <Col md={2} className="d-flex align-items-center justify-content-end">
          <Button variant="link" onClick={() => navigate('/cart')} style={{ color: '#FF9500', position: 'relative' }}>
            Cart
            {cartCount > 0 && (
              <Badge bg="secondary" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline-danger" onClick={handleLogout} className="ms-3">
            Logout
          </Button>
        </Col>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Display error message */}

      <Row>
        {filteredProducts.length === 0 && <Alert variant="danger">No products found.</Alert>}
        {filteredProducts.map(product => (
          <Col md={4} key={product.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{product.description}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ₱{product.price}
                </Card.Text>
                <Button
                  variant="primary"
                  style={{ backgroundColor: '#FF9500', borderColor: '#FF9500' }}
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="link"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ color: '#FF9500' }}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FrontStore;
