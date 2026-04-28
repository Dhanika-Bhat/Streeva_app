const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentId } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });
        if (!paymentId) return res.status(400).json({ message: 'Payment transaction ID is required' });

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0] || '',
            });
            totalAmount += product.price * item.quantity;
        }

        // Get store from first product
        const firstProduct = await Product.findById(items[0].product);
        const storeId = firstProduct ? firstProduct.store : null;

        const order = new Order({
            customer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            store: storeId,
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get customer's orders
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('store', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get store orders (for entrepreneur)
router.get('/store/:storeId', auth, async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) return res.status(404).json({ message: 'Store not found' });
        if (store.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const orders = await Order.find({ store: store._id })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update order status (entrepreneur)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const store = await Store.findById(order.store);
        if (!store || store.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.status = req.body.status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
