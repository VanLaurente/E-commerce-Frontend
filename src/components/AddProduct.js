import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

const AddProduct = () => {
  const [product, setProduct] = useState({
    barcode: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate barcode
    const isBarcodeDuplicate = products.some(p => p.barcode === product.barcode);
    if (isBarcodeDuplicate) {
      setErrorMessage('Barcode already exists. Please use a unique barcode.');
      return;
    }

    // Check for duplicate description
    const isDescriptionDuplicate = products.some(p => p.description.toLowerCase() === product.description.toLowerCase());
    if (isDescriptionDuplicate) {
      setErrorMessage('Description already exists. Please use a unique description.');
      return;
    }

    fetch('http://127.0.0.1:8000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add product');
        return response.json();
      })
      .then(data => {
        setSuccessMessage('Product added successfully!');
        setErrorMessage('');
        setTimeout(() => navigate('/view'), 1500);
      })
      .catch(() => setErrorMessage('There was an issue adding the product.'));
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
        <h3 className="text-center mb-4">Add New Product</h3>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Card className="mb-3" style={{ padding: '20px' }}>
          <Form.Group controlId="formBarcode">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              name="barcode"
              placeholder="Enter barcode"
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
              placeholder="Enter description"
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
              placeholder="Enter price"
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
              placeholder="Enter quantity"
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
              placeholder="Enter category"
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
          Add Product
        </Button>
      </Card>
    </Container>
  );
};

export default AddProduct;
