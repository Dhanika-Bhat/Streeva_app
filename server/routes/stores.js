const express = require('express');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { auth, entrepreneurOnly } = require('../middleware/auth');

const router = express.Router();

// Get all stores (with optional geo query)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radius, category, search } = req.query;
        let query = {};

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: (parseFloat(radius) || 50) * 1000, // km to meters
                },
            };
        }

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const stores = await Store.find(query).populate('owner', 'name email avatar').limit(50);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get single store with its products
router.get('/:id', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate('owner', 'name email avatar');
        if (!store) return res.status(404).json({ message: 'Store not found' });

        const products = await Product.find({ store: store._id });
        res.json({ store, products });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Create store (entrepreneur only)
router.post('/', auth, entrepreneurOnly, async (req, res) => {
    try {
        const { name, description, category, address, lat, lng, coverImage, phone } = req.body;

        const existingStore = await Store.findOne({ owner: req.user._id });
        if (existingStore) return res.status(400).json({ message: 'You already have a store' });

        const store = new Store({
            owner: req.user._id,
            name,
            description,
            category,
            address,
            phone,
            coverImage,
            location: { type: 'Point', coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0] },
        });

        await store.save();
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update store
router.put('/:id', auth, entrepreneurOnly, async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ message: 'Store not found' });
        if (store.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updates = req.body;
        if (updates.lat && updates.lng) {
            updates.location = { type: 'Point', coordinates: [parseFloat(updates.lng), parseFloat(updates.lat)] };
            delete updates.lat;
            delete updates.lng;
        }

        Object.assign(store, updates);
        await store.save();
        res.json(store);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete store
router.delete('/:id', auth, entrepreneurOnly, async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ message: 'Store not found' });
        if (store.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Product.deleteMany({ store: store._id });
        await store.deleteOne();
        res.json({ message: 'Store deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
