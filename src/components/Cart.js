import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Assume this will be populated with cart data
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId, newQuantity) => {
    // Logic to update quantity in the cart
    console.log(`Updated product ${productId} to quantity ${newQuantity}`);
  };

  const handleRemoveItem = (productId) => {
    // Logic to remove item from cart
    console.log(`Removed product with ID: ${productId}`);
  };

  const handleCheckout = () => {
    // Logic to handle checkout process
    console.log('Proceeding to checkout');
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Card style={{ margin: '20px', padding: '20px', background: 'white' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Your Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                      min="1"
                    />
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button variant="success" onClick={handleCheckout} disabled={cartItems.length === 0}>
          Checkout
        </Button>
      </Card>
    </Container>
  );
};

export default Cart;
