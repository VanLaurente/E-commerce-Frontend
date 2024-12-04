import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import logo from '../logo/logo.png'; // Adjust based on your actual file structure

const FrontStore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories derived from products
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [minPrice, setMinPrice] = useState(''); // Minimum price
  const [maxPrice, setMaxPrice] = useState(''); // Maximum price
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product ID for adding to cart
  const [quantity, setQuantity] = useState(1); // Quantity state
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to load products. Please try again.');
      });
  }, []);

  // Fetch cart count
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cart')
      .then(response => response.json())
      .then(cartItems => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      })
      .catch(error => console.error('Error fetching cart data:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Filter products based on search term, selected categories, and price range
  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(product.category) : true;
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;

    return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const handleAddToCart = (productId) => {
    setSelectedProduct(productId);
    setShowModal(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleConfirmAddToCart = () => {
    fetch(`http://127.0.0.1:8000/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: selectedProduct, quantity: quantity }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
        return response.json();
      })
      .then(() => {
        setShowModal(false);
        setQuantity(1);
        fetch('http://127.0.0.1:8000/api/cart')
          .then(response => response.json())
          .then(cartItems => {
            const count = cartItems.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
          })
          .catch(error => console.error('Error fetching cart data:', error));
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
        setErrorMessage('Failed to add item to cart. Please try again.');
      });
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <Container fluid style={{ background: '#FF9500', padding: '20px' }}>
      <Row className="mb-3" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <Col md={2} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '250px', height: 'auto' }} />
        </Col>
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar mb-2"
            style={{
              borderRadius: '25px',
              height: '50px',
              fontSize: '18px',
              border: '2px solid #FF9500',
              marginTop: '50px',
            }}
          />
        </Col>
        <Col md={2} className="d-flex align-items-center justify-content-end">
          <Button
            variant="link"
            onClick={() => navigate("/cart")}
            style={{ color: '#FF9500', position: 'relative' }}
          >
            <FiShoppingCart size={24} />
            {cartCount > 0 && (
              <Badge
                bg="secondary"
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  transform: 'translate(50%, -50%)',
                }}
              >
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline-danger" onClick={handleLogout} className="ms-3">
            Logout
          </Button>
        </Col>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <Col md={3}>
          <Card className="mt-0">
            <Card.Body>
              <Card.Title>Filter Products</Card.Title>
              <Card.Title>Filter by Category</Card.Title>
              {categories.map((category) => (
                <Form.Check
                  type="checkbox"
                  label={category}
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
              <Form.Group className="mb-2">
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Enter minimum price"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Enter maximum price"
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Row>
            {filteredProducts.length === 0 && <Alert variant="danger">No products found.</Alert>}
            {filteredProducts.map(product => (
              <Col md={4} key={product.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{product.description}</Card.Title>
                    <Card.Text>
                      <strong>Price:</strong> ₱{product.price}
                    </Card.Text>
                    <Button
                      variant="primary"
                      style={{ backgroundColor: '#FF9500', borderColor: '#FF9500' }}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ color: '#FF9500' }}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Quantity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmAddToCart}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FrontStore;
