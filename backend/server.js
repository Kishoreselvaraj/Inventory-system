require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const ProductRouter = require('./Router/Product.Router.jsx');
const userRouter = require('./Router/UserLogin.jsx');

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Log Environment Variables (for debugging)
console.log("MongoDB URI:", MONGO_URL);
console.log("Port:", PORT);

// Database Connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database Connected..");

    // Start Server only after DB connection is successful
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("Database Connection Error:", error);
});

// Routes
app.use('/admin/product', ProductRouter);
app.use('/user', userRouter);
