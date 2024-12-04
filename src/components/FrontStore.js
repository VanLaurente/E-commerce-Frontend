import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import logo from '../logo/logo.png'; // Adjust based on your actual file structure

const FrontStore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, []);

  // Fetch cart items
  const fetchCartItems = () => {
    fetch('http://127.0.0.1:8000/api/cart')
      .then((response) => response.json())
      .then((cartItems) => {
        const uniqueItemsCount = cartItems.filter((item) => item.quantity > 0).length; // Count unique items
        setCartCount(uniqueItemsCount);
      })
      .catch((error) => console.error('Error fetching cart data:', error));
  };

  // Fetch cart count
  useEffect(() => {
    fetchCartItems();
  }, []);  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Filter products based on search term, selected categories, and price range
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(product.category) : true;
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const handleAddToCart = (productId) => {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === productId);
    setQuantity(1); // Reset quantity to 1 when selecting a product
    if (product) {
      setShowModal(true);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
  
    const product = products.find((p) => p.id === selectedProduct);
    if (product) {
      if (quantity > product.quantity) {
        setErrorMessage('Quantity exceeds available stock.'); // Show error message for stock limit
        return; // Don't proceed if quantity exceeds available stock
      }
  
      // Proceed to add the product to the cart
      fetch('http://127.0.0.1:8000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selectedProduct, quantity }),
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Failed to add item to cart');
          });
        }
        return response.json();
      })
      .then(() => {
        setShowModal(false);
        fetchCartItems(); // Update the cart count after adding an item
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error);
        setErrorMessage(error.message); // Show detailed error message
      });
    }
  };
  
  

  const handleLogout = () => {
    navigate('/');
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
            onClick={() => navigate('/cart')}
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

      {loading && <Spinner animation="border" variant="primary" />}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
      <Col md={3}>
          <Card className="mt-0">
            <Card.Body>
              <Card.Title><strong>Filter Products</strong></Card.Title>
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
                <Card.Title>Filter by Price</Card.Title>
                <Form.Label>Minimum Price</Form.Label>
                <Form.Control
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Enter minimum price"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Maximum Price</Form.Label>
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
            {filteredProducts.map((product) => (
              <Col md={4} key={product.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{product.description}</Card.Title>
                    <Card.Text>
                      <strong>Price:</strong> ₱{product.price}
                      <br />
                      <strong>Quantity Available:</strong> {product.quantity}
                    </Card.Text>
                    <Button
                      variant="primary"
                      disabled={product.quantity === 0}
                      style={{ backgroundColor: '#FF9500', borderColor: '#FF9500' }}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
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

      {/* Modal for Adding to Cart */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter the quantity to add to your cart:</p>
          <Form.Control
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={selectedProduct ? products.find((p) => p.id === selectedProduct).quantity : 1} // Set max to available quantity
            placeholder="Quantity"
          />
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FrontStore;
