import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(error => {
        console.error('Error fetching product:', error);
        setErrorMessage('Failed to load product data. Please try again.');
      });
  }, [id]);

  const handleAddToCart = () => {
    setShowModal(true); // Show modal to ask for quantity
  };

  const handleConfirmAddToCart = () => {
    // Add product to cart logic
    const cartItem = {
      product_id: id,
      quantity: parseInt(quantity, 10),
    };

    fetch('http://127.0.0.1:8000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
        return response.json();
      })
      .then(() => {
        alert('Product added to cart successfully!');
        setShowModal(false); // Close the modal
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      });
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: '#ff9500',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="text-center py-3" style={{ borderBottom: '1px solid #ddd' }}>
          <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
        </div>
        <Card.Body>
          <h5 className="text-center mb-3" style={{ fontWeight: 'bold', color: '#333' }}>
            {product.description || 'Product Details'}
          </h5>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div style={{ fontSize: '14px', color: '#555' }}>
            <p>
              <strong>Barcode:</strong> {product.barcode || 'N/A'}
            </p>
            <p>
              <strong>Price:</strong> ₱{product.price}
            </p>
            <p>
              <strong>Quantity Available:</strong> {product.quantity || 'N/A'}
            </p>
            <p>
              <strong>Category:</strong> {product.category || 'N/A'}
            </p>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="primary"
              onClick={handleAddToCart}
              style={{
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                borderRadius: '20px',
                flex: 1,
                marginRight: '5px',
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/frontstore')}
              style={{
                borderRadius: '20px',
                flex: 1,
                marginLeft: '5px',
              }}
            >
              Back to Store
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Quantity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="quantityInput">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max={product.quantity || 1}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetail;
