const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  stallName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
}, 
{ 
  timestamps: true 
}
);

module.exports = mongoose.model('User', userSchema);
