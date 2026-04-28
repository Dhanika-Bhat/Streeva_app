const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const sendOTP = async (email, otp) => {
    try {
        let transporter;
        let isRealEmail = false;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Send real email if configured
            transporter = nodemailer.createTransport({
                service: 'gmail', // or your preferred SMTP host
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            isRealEmail = true;
        } else {
            // Fake email for testing to avoid spam blocking
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass }
            });
        }

        let info = await transporter.sendMail({
            from: '"Streeva Auth" <no-reply@streeva.in>',
            to: email,
            subject: "Streeva Account Verification OTP",
            text: `Your One Time Password is: ${otp}\n\nIt is valid for 10 minutes. Do not share this with anyone.`
        });

        console.log("\n=========================");
        if (isRealEmail) {
            console.log("REAL OTP EMAIL SENT TO INBOX:", email);
        } else {
            console.log("TEST OTP EMAIL INTERCEPTED. Preview URL: ", nodemailer.getTestMessageUrl(info));
        }
        console.log("Direct OTP (for terminal bypass testing):", otp);
        console.log("=========================\n");
    } catch (err) {
        console.log("Failed to send OTP email:", err);
    }
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'customer',
            isEmailVerified: true
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'streeva_secret_key_2024', { expiresIn: '7d' });

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });



        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'streeva_secret_key_2024', { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please register again.' });
        }

        user.isEmailVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'streeva_secret_key_2024', { expiresIn: '7d' });

        res.json({
            message: 'Verification successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
