const express = require('express');
const multer = require('multer');
const ProductRouter = express.Router();
const Product = require("../Models/product.model.jsx");
const path = require('path');
const fs = require('fs');
const cors=require('cors');
ProductRouter.use(cors());


// Set the images path for serving static files
const imagesPath = path.join(__dirname, '../uploads'); // Adjust the path accordingly
// Ensure uploads directory exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Serve static files from the uploads directory
ProductRouter.use('/images', express.static(imagesPath));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Replace spaces with hyphens
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get all products
ProductRouter.get('/get-items', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get product by ID
ProductRouter.get('/get-item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productById = await Product.findById(id);
        if (!productById) {
            return res.status(404).json({ message: `Product with ID ${id} not found` });
        }
        res.status(200).json(productById);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new product with image upload
ProductRouter.post('/post-item', upload.single('image'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = await Product.create({
            name,
            category,
            image
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product with optional image upload
ProductRouter.put('/update-item/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const updateFields = { name, category };
        if (image) updateFields.image = image;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: `Product with ID ${id} not found` });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product by ID
ProductRouter.delete('/delete-item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: `Product with ID ${id} not found` });
        }

        // Delete image file if exists
        if (deletedProduct.image) {
            const imagePath = path.join(uploadPath, deletedProduct.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`Failed to delete image: ${err.message}`);
            });
        }

        res.status(200).json({ message: `Product with ID ${id} has been deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = ProductRouter;
