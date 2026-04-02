const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const categoryFilter = req.query.category ? { category: req.query.category } : {};
        const products = await Product.find({ ...categoryFilter }).populate('category', 'name slug');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, slug, price, description, images, category, inStock, isReadyMade } = req.body;
        const product = new Product({
            name,
            slug,
            price,
            category,
            images,
            description,
            isReadyMade: isReadyMade !== undefined ? isReadyMade : true,
            inStock: inStock !== undefined ? inStock : true
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, slug, price, description, images, category, isReadyMade, inStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.slug = slug || product.slug;
            product.price = price || product.price;
            product.description = description || product.description;
            product.images = images || product.images;
            product.category = category || product.category;
            product.isReadyMade = isReadyMade !== undefined ? isReadyMade : product.isReadyMade;
            product.inStock = inStock !== undefined ? inStock : product.inStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
