// src/components/ViewProduct.js
import React, { useEffect, useState } from 'react';
import { Form, ListGroup, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        console.error('There was an error fetching products!', error);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setErrorMessage('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredProducts = products.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  );

  useEffect(() => {
    if (searchTerm && filteredProducts.length === 0) {
      setErrorMessage('No products found for your search.');
    } else {
      setErrorMessage('');
    }
  }, [searchTerm, filteredProducts]);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
        console.log('Product deleted');
      } else {
        console.error('Error deleting the product');
      }
    })
    .catch(error => {
      console.error('There was an error deleting the product!', error);
    });
  };

  return (
    <>
      <Button variant="primary" onClick={() => navigate('/add')}>Add Product</Button>
      <Form.Control
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="mt-3">
        <h5>Filter by Category:</h5>
        {categories.map(category => (
          <Form.Check
            type="checkbox"
            label={category}
            key={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
          />
        ))}
      </div>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <ListGroup>
        {filteredProducts.map(product => (
          <ListGroup.Item key={product.id}>
            {product.description} - ${product.price}
            <Button variant="info" onClick={() => navigate(`/edit/${product.id}`)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(product.id)} className="ms-2">Delete</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default ViewProduct;
