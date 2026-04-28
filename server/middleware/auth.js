const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'streeva_secret_key_2024');
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Token is not valid' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const entrepreneurOnly = (req, res, next) => {
    if (req.user.role !== 'entrepreneur') {
        return res.status(403).json({ message: 'Access denied. Entrepreneurs only.' });
    }
    next();
};

module.exports = { auth, entrepreneurOnly };
