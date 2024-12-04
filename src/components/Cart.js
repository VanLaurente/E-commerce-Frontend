import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch cart data when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cart')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        return response.json();
      })
      .then((data) => setCartItems(data))
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        setErrorMessage('Failed to load cart items. Please try again.');
      });
  }, []);

  const handleUpdateQuantity = (productId, newQuantity) => {
    fetch(`http://127.0.0.1:8000/api/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }
        return response.json();
      })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
      });
  };

  const handleRemoveItem = (productId) => {
    fetch(`http://127.0.0.1:8000/api/cart/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      })
      .catch((error) => {
        console.error('Error removing item:', error);
        alert('Failed to remove item. Please try again.');
      });
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
    // Add checkout logic here
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Card style={{ margin: '20px', padding: '20px', background: 'white' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Your Cart</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.description}</td>
                    <td>₱{item.product.price}</td>
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
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-primary"
                onClick={() => navigate('/frontstore')}
              >
                Back to Store
              </Button>
              <div className="d-flex align-items-center">
                <h4 style={{ marginRight: '10px' }}>Total Price: ₱{totalPrice}</h4>
                <Button
                  variant="success"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Cart;
