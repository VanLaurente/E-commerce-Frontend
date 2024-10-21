import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [product, setProduct] = useState({ barcode: '', description: '', price: '', quantity: '', category: '' });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
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
    .then(response => response.json())
    .then(data => {
      console.log('Product updated:', data);
      navigate('/');
    })
    .catch(error => {
      console.error('There was an error updating the product!', error);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBarcode">
        <Form.Label>Barcode</Form.Label>
        <Form.Control type="text" name="barcode" value={product.barcode} onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" value={product.description} onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price" value={product.price} onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control type="number" name="quantity" value={product.quantity} onChange={handleInputChange} required />
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" name="category" value={product.category} onChange={handleInputChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">Update Product</Button>
    </Form>
  );
};

export default EditProduct;
