import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cards from '../../components/Cards/Cards';
// import { useLocation } from 'react-router-dom';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const location = useLocation();
  console.log(products)
  // const { email } = location.state || {}; 
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://inventory-system-vert.vercel.app/user/product/get-items');
        setProducts(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message); // Improved error handling
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://inventory-system-vert.vercel.app/user/product/delete-item/${id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== id)); 
      alert(`Product has been deleted`);
    } catch (error) {
      alert(error.response ? error.response.data.message : error.message); // Detailed error alert
    }
  };

  const handleView = (id) => {
    navigate(`/view-product/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalProduct = products.length;
  const uniqueCategories = [...new Set(products.map(product => product.category))]; // Get unique categories
  const cardsData = [
    { id: 1, title: 'Total Products', content: totalProduct },
    { id: 2, title: 'Total Sales', content: '0' },
    { id: 3, title: 'Out of Stock', content: '0' },
    { id: 4, title: 'All Categories', content: uniqueCategories.length }, // Dynamic category count
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
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <span>
                    <button onClick={() => handleDelete(product.productId)}>
                      Delete
                    </button>
                  </span>
                  <span>
                    <button onClick={() => handleView(product.productId)}>
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
