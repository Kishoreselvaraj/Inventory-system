import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Product.scss';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/product/get-items');
        setProducts(response.data);
      } catch (error) {
        setError(error.message || "Could not fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const product = products.find((p) => p._id === selectedId);
    setSelectedProduct(product);
  };

  const handleStoreProduct = async () => {
    if (!selectedProduct || !price || !quantity || price <= 0 || quantity <= 0) {
      alert('Please select a product and enter valid price and quantity');
      return;
    }

    try {
      await axios.post("http://localhost:5000/user/product/store-item", {
        productId: selectedProduct._id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        category: selectedProduct.category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      });
      alert('Product stored successfully!');
      setSelectedProduct(null);
      setPrice('');
      setQuantity('');
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      alert(`Error storing product: ${JSON.stringify(errorMessage)}`);
    }
  };

  return (
    <div className="product">
      <div className="form-group">
        <label htmlFor="productSelect">Choose Product:</label>
        <select
          id="productSelect"
          value={selectedProduct ? selectedProduct._id : ''}
          onChange={handleSelectChange}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - {product.category}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="product-details">
          <p><strong>Product Name:</strong> {selectedProduct.name}</p>
          <p><strong>Category:</strong> {selectedProduct.category}</p>
          <img src={selectedProduct.image} alt={selectedProduct.name} width="100" />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <button type="button" className="submit-btn" onClick={handleStoreProduct}>
        Store Selected Product
      </button>
    </div>
  );
}

export default Product;
