import React, { useEffect, useState, useRef } from 'react';
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
  const timerID = useRef(null);

  const fetchData = () => {
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
  };

  useEffect(() => {
    fetchData();
    timerID.current = setInterval(fetchData, 3000);
    return () => {
      clearInterval(timerID.current);
    };
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

  // Delete button
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); 
    navigate('/'); 
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px', height: '100vh' }}>
      <Row className="mb-3" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <Col md={2} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '250px', height: 'auto' }} />
        </Col>
        <Col md={8} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Control
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar mb-2"
            style={{
              borderRadius: '25px',
              width: '100%',
              height: '50px',
              fontSize: '18px',
              border: '2px solid #FF9500',
            }}
          />
        </Col>
        <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
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
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.barcode}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>₱{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button
                          variant="primary"
                          style={{ backgroundColor: '#FF9500', borderColor: '#FF9500' }}
                          onClick={() => navigate(`/edit/${product.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          className="ms-2"
                        >
                          Delete
                        </Button>
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
              {categories.map((category) => (
                <Form.Check
                  type="checkbox"
                  label={category}
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  style={{ cursor: 'pointer' }}
                  inputProps={{ style: { accentColor: '#FF9500' } }}
                />
              ))}
            </Card.Body>
          </Card>
          <Button
            onClick={() => navigate('/add')}
            className="w-100 mt-2"
            style={{
              backgroundColor: 'white',
              color: '#FF9500',
              border: '2px solid #FF9500',
              borderRadius: '8px',
              height: '50px',
              fontSize: '20px',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#FF9500';
              e.target.style.border = 'solid white 2px';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'; 
              e.target.style.color = '#FF9500';
            }}
          >
            Add Product
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProduct;
