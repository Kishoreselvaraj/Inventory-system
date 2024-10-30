require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')
const app= express();
// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
// Router 
const ProductRouter = require('./Router/Product.Router.jsx');
const userRouter = require('./Router/UserLogin.jsx');
const PORT=process.env.PORT; 
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server running on the port ${PORT}`);

})
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Database Connected..");
})
.catch((error) => {
    console.error("Database Connection Error:", error); // Log the actual error
});

// Get, Post, Put, Detete Products
app.use('/admin/product',ProductRouter);
app.use('/user',userRouter);

