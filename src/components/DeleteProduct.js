// src/components/DeleteProduct.js
import React, { useEffect, useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => {
        console.error('There was an error fetching products!', error);
      });
  }, []);

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
    <ListGroup>
      {products.map(product => (
        <ListGroup.Item key={product.id}>
          {product.description} - ${product.price}
          <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default DeleteProduct;
