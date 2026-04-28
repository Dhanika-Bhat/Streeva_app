const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
        type: String,
        enum: ['handicrafts', 'food', 'clothing', 'beauty', 'jewelry', 'home-decor', 'art', 'other'],
        default: 'other'
    },
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
