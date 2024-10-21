import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import DeleteProduct from './components/DeleteProduct';
import ViewProduct from './components/ViewProduct';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/add" element={<AddProduct />} />
                <Route path="/edit/:id" element={<EditProduct />} />
                <Route path="/delete/:id" element={<DeleteProduct />} />
                <Route path="/view" element={<ViewProduct />} />
                <Route path="/" element={<ViewProduct />} /> {/* Default route */}
            </Routes>
        </Router>
    );
}

export default App;
