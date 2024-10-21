import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ViewProduct from './components/ViewProduct';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/add" element={<AddProduct />} />
                <Route path="/edit/:id" element={<EditProduct />} />
                <Route path="/view" element={<ViewProduct />} />
                <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
        </Router>
    );
}

export default App;
