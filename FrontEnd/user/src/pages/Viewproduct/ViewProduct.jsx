import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewProduct.scss';

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/product/get-item/${id}`);
        setProduct(response.data);
        // console.log(product);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message); // Improved error handling
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure product exists before accessing properties
  if (!product) return <div>No product found.</div>;

  // Construct the image URL based on the path defined in your Express server
  const imageUrl = `http://localhost:5000/${product.image}`;


  return (
    <div className="view-product">
      
      <h1>{product.name}</h1>
      <img src={imageUrl} alt={product.name} />
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p> {/* Display the price */}
      <p>Quantity Available: {product.quantity}</p> {/* Display quantity */}
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

export default ViewProduct;
