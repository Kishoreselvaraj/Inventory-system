const express = require('express');
const bcrypt = require('bcrypt');
const Register = require('../models/user');
const StoredProduct = require('../models/addproduct');
const userRouter = express.Router();
const cors = require('cors');

userRouter.use(cors());

// Register route
userRouter.post('/register', async (req, res) => {
  const { stallName, email, password } = req.body;

  if (!stallName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({
      stallName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all products
userRouter.get('/product/get-items', async (req, res) => {
  try {
    const products = await StoredProduct.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products: " + error.message });
  }
});

// Get a product by ID
userRouter.get('/product/get-item/:id', async (req, res) => {
  try {
    const product = await StoredProduct.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product by ID: " + error.message });
  }
});

// Delete a product by ID
userRouter.delete('/product/delete-item/:id', async (req, res) => {
  try {
    const result = await StoredProduct.deleteOne({ productId: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found or already deleted' });
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product: " + error.message });
  }
});
userRouter.put('/product/update-item/:id', async (req, res) => {
  try {
    const { quantity } = req.body; // Get the quantity from the request body
    const productId = req.params.id;

    console.log("Updating product with ID:", productId, "to quantity:", quantity);

    const updatedProduct = await StoredProduct.findOneAndUpdate(
      { productId: productId }, // Ensure this matches your schema
      { $set: { quantity: quantity } }, // Update quantity
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("Updated product:", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ message: "Error updating product quantity: " + error.message });
  }
});

// Store a new product
userRouter.post('/product/store-item', async (req, res) => {
  const { productId, name, image, category, price, quantity } = req.body;

  if (!productId || !price || !quantity) {
    return res.status(400).json({ message: 'Product ID, price, and quantity are required.' });
  }

  try {
    const storedProduct = new StoredProduct({
      productId,
      name,
      image,
      category,
      price,
      quantity,
    });

    await storedProduct.save();
    res.status(201).json({ message: 'Product stored successfully!' });
  } catch (error) {
    console.error("Error during product storage:", error);
    res.status(500).json({
      message: "Server error",
      details: error.message || 'Internal server error',
    });
  }
});

module.exports = userRouter;
