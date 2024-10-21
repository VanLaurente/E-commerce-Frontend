// src/components/AddProduct.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [product, setProduct] = useState({ barcode: '', description: '', price: '', quantity: '', category: '' });
  const navigate = useNavigate(); // Hook to navigate

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product added:', data);
      navigate('/'); // Redirect to ViewProduct after adding
    })
    .catch(error => {
      console.error('There was an error adding the product!', error);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBarcode">
        <Form.Label>Barcode</Form.Label>
        <Form.Control type="text" name="barcode" onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price" onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control type="number" name="quantity" onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" name="category" onChange={handleInputChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">Add Product</Button>
    </Form>
  );
};

export default AddProduct;
