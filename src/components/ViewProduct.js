import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo/logo.png';

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

  //search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setErrorMessage('');
    }
  };

  //category
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  //filtering category
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

  //delete button
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
    <Container fluid style={{ background: '#FF9500', padding: '20px', height: '100vh' }}>
      <Row className="mb-3" style={{ background: 'white', padding: '20px', marginLeft: '1px', marginRight: '1px',borderRadius: '8px' }}>
        <Col md={2} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '250px', height: 'auto' }} />
        </Col>
        <Col md={10}>
          <Form.Control
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar mb-2"
            style={{ borderRadius: '25px', marginTop: '50px', width: '59%' }} 
          />
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Product List</Card.Title>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Barcode</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.barcode}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>₱{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button variant="primary" style={{ backgroundColor: '#FF9500', borderColor: '#FF9500' }} onClick={() => navigate(`/edit/${product.id}`)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(product.id)} className="ms-2">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Filter by Category</Card.Title>
              {categories.map(category => (
                <Form.Check
                  type="checkbox"
                  label={category}
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              ))}
            </Card.Body>
          </Card>
          <Button variant="primary" onClick={() => navigate('/add')} className="w-100 mt-2">Add Product</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProduct;
