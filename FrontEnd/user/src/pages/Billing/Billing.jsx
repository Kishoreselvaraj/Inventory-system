import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billing.scss'; // Ensure you have this SCSS file for styling

function Billing() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1); // Default quantity

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://inventory-system-vert.vercel.app/user/product/get-items');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Add item to the selected items
  const handleAddItem = () => {
    const product = products.find(p => p._id === selectedProduct);
    if (!product || quantity <= 0) return; // Ensure valid product and quantity

    const existingItemIndex = selectedItems.findIndex(item => item.product._id === product._id);

    if (existingItemIndex !== -1) {
      // Increase quantity if product already exists in selectedItems
      const newItems = [...selectedItems];
      newItems[existingItemIndex].quantity += quantity;
      setSelectedItems(newItems);
    } else {
      // Add new product to selectedItems with the chosen quantity
      setSelectedItems([...selectedItems, { product, quantity }]);
    }

    // Reset the selected product and quantity
    setSelectedProduct('');
    setQuantity(1);
  };

  // Update item quantity in selected items and backend
  const handleQuantityChange = async (productId, newQuantity) => {
    const updatedQuantity = Math.max(1, newQuantity); // Ensure minimum quantity is 1

    const newItems = selectedItems.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: updatedQuantity }; // Update local state
      }
      return item;
    });
    setSelectedItems(newItems);

    // Log for debugging
    console.log(`Updating quantity for product ID: ${productId} to ${updatedQuantity}`);

    // Update quantity in the backend
    try {
      await axios.put(`https://inventory-system-vert.vercel.app/user/product/update-item/${productId}`, { quantity: updatedQuantity });
    } catch (error) {
      console.error("Error updating product quantity:", error);
      // Optionally, revert the local state if the update fails
    }
  };

  // Remove item from selected items
  const handleRemoveItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.product._id !== productId));
  };

  // Calculate total price based on selected items
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [selectedItems]);

  // Mark items as paid and update the backend quantities
  const handlePaid = async () => {
    await Promise.all(
      selectedItems.map(async item => {
        const newQuantity = item.product.quantity - item.quantity; // Calculate new quantity
        console.log(`Processing payment for product ID: ${item.product._id}, new quantity: ${newQuantity}`);
        try {
          await axios.put(`https://inventory-system-vert.vercel.app/user/product/update-item/${item.product._id}`, { quantity: newQuantity });
        } catch (error) {
          console.error("Error updating product quantity:", error);
        }
      })
    );

    // Clear selected items after payment
    setSelectedItems([]);
    setTotalPrice(0); // Reset total price
  };

  // Clear selected items
  const handleClear = () => {
    setSelectedItems([]);
    setTotalPrice(0);
  };

  return (
    <div className="billing">
      <h2>Billing System</h2>

      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="" disabled>Select a product</option>
        {products.map(product => (
          <option key={product._id} value={product._id}>
            {product.name} - ${product.price}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
        style={{ marginLeft: '10px' }}
      />
      <button onClick={handleAddItem} style={{ marginLeft: '10px' }}>Add</button>

      <h3>Selected Items:</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map(item => (
            <tr key={item.product._id}>
              <td>{item.product.name}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value, 10))}
                />
              </td>
              <td>${item.product.price}</td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoveItem(item.product._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

      <button onClick={handlePaid} style={{ marginTop: '10px', marginRight: '10px' }}>Paid</button>
      <button onClick={handleClear} style={{ marginTop: '10px' }}>Clear</button>
    </div>
  );
}

export default Billing;
