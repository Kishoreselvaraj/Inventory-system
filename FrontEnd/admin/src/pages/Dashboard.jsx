import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cards from '../components/Cards/Cards';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/product/get-items');
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/product/delete-item/${id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== id)); // Remove product from state
      alert(`Product has been deleted`);
    } catch (error) {
      alert(error);
    }
  };

  const handleView = (id) => {
    navigate(`/view-product/${id}`); // Navigate to the view product page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalProduct = products.length;
  const cardsData = [
    { id: 1, title: 'Total Products', content: totalProduct },
    { id: 2, title: 'Total Sales', content: '0' },
    { id: 3, title: 'Out of Stock', content: '0' },
    { id: 4, title: 'All Categories', content: '4' },
  ];
  
  return (
    <div className='dashboard'>
      <div className='details'>
        {cardsData.map((card) => (
          <Cards key={card.id} title={card.title} content={card.content} />
        ))}
      </div>
      <div className="productList">
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Product</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <span>
                    <button onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </span>
                  <span>
                    <button onClick={() => handleView(product._id)}>
                      View Product
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
