import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar/Navbar';
import Product from './pages/AddProduct/Product';
import ViewProduct from './pages/Viewproduct/ViewProduct';

function App() {
  return (
    <Router>
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<Product />} />
        <Route path='/view-product/:id' element={<ViewProduct />}></Route>
      </Routes>
    </div>
  </Router>
  )
}

export default App