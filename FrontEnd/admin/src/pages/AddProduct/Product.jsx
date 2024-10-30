import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Product.scss';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({ name: '', image: '', category: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://inventory-system-vert.vercel.app/admin/product/get-items');
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value }); // Update product state
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProduct({ ...product, [name]: files[0] }); // Update product state with file
  };

  const handlePost = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('image', product.image);
    formData.append('category', product.category);

    try {
      const response = await axios.post("https://inventory-system-vert.vercel.app/admin/product/post-item", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });
      setProducts((prev) => [...prev, response.data]); // Add new product to the list
      setProduct({ name: '', image: '', category: '' }); // Reset form fields
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="product">
      <form onSubmit={handlePost}>
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={product.name} // Controlled input
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleFileChange} // Handle file input separately
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Product Category:</label>
          <select
            id="category"
            name="category"
            value={product.category} // Controlled input
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="grocery">Grocery</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default Product;
