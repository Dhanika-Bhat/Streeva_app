const express = require('express');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { auth, entrepreneurOnly } = require('../middleware/auth');

const router = express.Router();

// Get all products (filter by category, search, store)
router.get('/', async (req, res) => {
    try {
        const { category, search, store, featured, limit } = req.query;
        let query = {};

        if (category) query.category = category;
        if (store) query.store = store;
        if (featured === 'true') query.isFeatured = true;
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];

        const products = await Product.find(query)
            .populate('store', 'name category')
            .limit(parseInt(limit) || 50)
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('store', 'name category owner address');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Create product (entrepreneur only)
router.post('/', auth, entrepreneurOnly, async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });
        if (!store) return res.status(400).json({ message: 'Create a store first' });

        const { name, description, price, images, category, stock, isFeatured } = req.body;
        const product = new Product({
            store: store._id,
            name,
            description,
            price,
            images: images || [],
            category,
            stock: stock || 0,
            isFeatured: isFeatured || false,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update product
router.put('/:id', auth, entrepreneurOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const store = await Store.findOne({ owner: req.user._id });
        if (!store || product.store.toString() !== store._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete product
router.delete('/:id', auth, entrepreneurOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const store = await Store.findOne({ owner: req.user._id });
        if (!store || product.store.toString() !== store._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
