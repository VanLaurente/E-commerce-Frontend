import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo/logo.png';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const [shippingDetails, setShippingDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);

  const handleCheckout = () => {
    if (!shippingDetails || !paymentMethod) {
      setErrorMessage('Please provide both shipping details and payment method.');
      return;
    }

    const cartItemsToCheckout = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    fetch('http://127.0.0.1:8000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping_details: shippingDetails,
        payment_method: paymentMethod,
        total_amount: totalPrice,
        cartItems: cartItemsToCheckout,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to process checkout');
        }
        return response.json();
      })
      .then(() => {
        setShowModal(true); 
      })
      .catch((error) => {
        console.error('Error during checkout:', error);
        alert('Failed to complete checkout. Please try again.');
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/frontstore');
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Card style={{ margin: '20px', padding: '20px', background: 'white' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Checkout</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your shipping address"
              value={shippingDetails}
              onChange={(e) => setShippingDetails(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Choose a payment method</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="gcash">GCash</option>
            </Form.Select>
          </Form.Group>
          
          <h4 className="text-center">Ordered Products:</h4>
          <ul className="list-unstyled text-center">
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.product.description} (Quantity: {item.quantity}) - ₱{(item.product.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <h4 className="text-center">Total Price: ₱{totalPrice}</h4>
          <div className="text-center mt-3">
            <Button variant="success" onClick={handleCheckout}>
              Confirm Checkout
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button
              variant="danger"
              onClick={() => navigate('/frontstore')}
              className="me-3"
            >
              Back to Store
            </Button>
            <Button
              variant="danger"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </Button>
          </div>
        </Form>

        {/* Modal for checkout success */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Checkout Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your order has been successfully checked out! Thank you.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Go to Store
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Container>
  );
};

export default Checkout;
