import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Modal } from 'react-bootstrap'; // Removed Alert from here
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cart')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        return response.json();
      })
      .then((data) => {
        setCartItems(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        setErrorMessage('Failed to load cart items. Please try again.');
      });
  }, []);

  const handleUpdateQuantity = (productId, newQuantity, availableQuantity) => {
    if (newQuantity < 1 || newQuantity > availableQuantity) {
      setModalMessage(`Please enter a quantity between 1 and ${availableQuantity}`);
      setShowModal(true);
      return;
    }

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

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
    : '0.00';

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Card style={{ margin: '20px', padding: '20px', background: 'white' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Your Cart</h3>
        {errorMessage && <div className="text-center text-danger">{errorMessage}</div>} {/* Changed Alert to div */}
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty.</p>
          </div>
        ) : (
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
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value), item.product.quantity)}
                      min="1"
                      max={item.product.quantity} // Ensure max is set to available quantity
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
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            variant="outline-primary"
            onClick={() => navigate('/frontstore')}
            style={{ marginRight: '20px' }} 
          >
            Back to Store
          </Button>
          {cartItems.length > 0 && (
            <div className="d-flex align-items-center">
              <h4 className="mb-0" style={{ marginRight: '30px' }}>Total Price: ₱{totalPrice}</h4>
              <Button variant="success" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Modal for error messages */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
