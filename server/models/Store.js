const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['handicrafts', 'food', 'clothing', 'beauty', 'jewelry', 'home-decor', 'art', 'other'],
        default: 'other'
    },
    address: { type: String, default: '' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    coverImage: { type: String, default: '' },
    phone: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
