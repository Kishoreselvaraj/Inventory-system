// storedProduct.js
const mongoose = require('mongoose');

const storedProductSchema = new mongoose.Schema({
  productId: String,  // Changed from Number to String
  name: String,
  image: String,
  category: String,
  price: Number,
  quantity: Number,
});

module.exports = mongoose.model('StoredProduct', storedProductSchema);
