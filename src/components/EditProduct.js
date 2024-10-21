import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png'; // Ensure the path is correct

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    barcode: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        return response.json();
      })
      .then(data => {
        console.log('Product updated:', data);
        setSuccessMessage('Product updated successfully!');
        setErrorMessage('');

        // Navigate to the product view page after a short delay
        setTimeout(() => navigate('/view'), 1500);
      })
      .catch(error => {
        console.error('Error updating product:', error);
        setErrorMessage('There was an issue updating the product. Please try again.');
      });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ height: '100vh', background: '#FF9500' }}
    >
      <Card style={{ width: '500px', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        <h3 className="text-center mb-4">Edit Product</h3>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}


        <Card className="mb-3" style={{ padding: '20px' }}>
          <Form.Group controlId="formBarcode">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              name="barcode"
              value={product.barcode}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Card>

        <Card className="mb-3" style={{ padding: '20px' }}>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Card>

        <Card className="mb-3" style={{ padding: '20px' }}>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Card>

        <Card className="mb-3" style={{ padding: '20px' }}>
          <Form.Group controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Card>

        <Card className="mb-4" style={{ padding: '20px' }}>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Card>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          style={{ background: '#FF9500', border: 'none', borderRadius: '25px' }}
          onClick={handleSubmit}
        >
          Update Product
        </Button>
      </Card>
    </Container>
  );
};

export default EditProduct;
