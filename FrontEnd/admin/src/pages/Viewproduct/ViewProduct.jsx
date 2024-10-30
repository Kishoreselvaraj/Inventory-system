import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewProduct.scss';

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/product/get-item/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Construct the image URL based on the path defined in your Express server
  const imageUrl = `http://localhost:5000/${product.image}`; // Assuming product.image contains the filename

  return (
    <div className="view-product">
      <h1>{product.name}</h1>
      <img src={imageUrl} alt={product.image} />
      <p>Category: {product.category}</p>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

export default ViewProduct;
