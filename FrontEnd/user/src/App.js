import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Product from './pages/AddProduct/Product';
import ViewProduct from './pages/Viewproduct/ViewProduct';
import Billing from './pages/Billing/Billing';

function App() {
  const location = useLocation();
  const noNavRoutes = ['/', '/login', '/register'];

  return (
    <div className='app'>
      {!noNavRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/addproduct" element={<Product />} />
        <Route path="/billing" element={<Billing />} />
        <Route path='/view-product/:id' element={<ViewProduct />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
