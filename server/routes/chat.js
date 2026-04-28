const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Product = require('../models/Product');

let genAI = null;
let model = null;

try {
    if (process.env.GEMINI_API_KEY) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
} catch (e) {
    console.log('Gemini AI not configured, using fallback responses');
}

const SYSTEM_PROMPT = `You are Streeva Assistant, an advanced, highly capable AI chatbot for the Streeva platform — an e-commerce platform that empowers women entrepreneurs in India.
You have real-time access to the platform's database (Stores and Products) which will be provided to you in this prompt. 
When a user asks about stores, products, locations, or pricing, use the provided context to give EXACT, detailed recommendations based explicitly on the real data.

Instructions:
- Be friendly, supportive, and encouraging.
- Format lists beautifully using markdown bullet points.
- If a user asks for clothing stores, list the ones from the context.
- Include prices and store names naturally in conversations.
- Keep responses engaging but concise.`;

const FALLBACK_RESPONSES = {
    greeting: "Hello! 👋 Welcome to Streeva! I'm your AI assistant. I can help you discover amazing women-owned businesses, find products, or navigate the platform. What would you like to explore today?",
    stores: "You can find women-owned stores by visiting our Marketplace page or checking the Map to find businesses near you! We have stores in categories like Handicrafts, Food, Clothing, Beauty, Jewelry, and more. 🛍️",
    products: "Our marketplace features unique products from talented women entrepreneurs! You can browse by category, search for specific items, or check out our featured products on the home page. ✨",
    orders: "You can view your order history in your Profile page. If you're an entrepreneur, your Dashboard shows all incoming orders with status tracking. 📦",
    help: "I can help you with:\n• 🏪 Finding stores near you\n• 🛒 Product recommendations\n• 📦 Order information\n• 🗺️ Using the map feature\n• 👩‍💼 Setting up your business\n\nJust ask me anything!",
    default: "That's a great question! While I'm a basic assistant right now, you can explore our Marketplace for products, use the Map to find nearby stores, or visit the Dashboard if you're an entrepreneur. Is there something specific I can help with? 😊",
};

function getFallbackResponse(message) {
    const msg = message.toLowerCase();
    if (msg.match(/hi|hello|hey|greet/)) return FALLBACK_RESPONSES.greeting;
    if (msg.match(/store|shop|business|find/)) return FALLBACK_RESPONSES.stores;
    if (msg.match(/product|buy|purchase|item/)) return FALLBACK_RESPONSES.products;
    if (msg.match(/order|track|deliver|ship/)) return FALLBACK_RESPONSES.orders;
    if (msg.match(/help|assist|what can/)) return FALLBACK_RESPONSES.help;
    return FALLBACK_RESPONSES.default;
}

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        if (!model) {
            return res.json({ reply: getFallbackResponse(message) });
        }

        // Fetch live context from database to supercharge the AI
        const stores = await Store.find().select('name category address rating').limit(30);
        const products = await Product.find().populate('store', 'name').select('name price category store').limit(60);
        
        let dbContext = "\nCurrent Real-time Streeva Database Data:\n";
        dbContext += "\n=== AVAILABLE STORES ===\n" + stores.map(s => `- ${s.name} (Category: ${s.category}, Rating: ${s.rating}/5) at ${s.address}`).join('\n');
        dbContext += "\n=== AVAILABLE PRODUCTS ===\n" + products.map(p => `- ${p.name} - ₹${p.price} (Category: ${p.category}) sold by ${p.store?.name || 'Unknown'}`).join('\n');
        
        const dynamicPrompt = SYSTEM_PROMPT + "\n\n" + dbContext + "\n\nRemember to ONLY use the above real data when recommending products or stores!";

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: 'Follow these core instructions: ' + dynamicPrompt }] },
                { role: 'model', parts: [{ text: "I understand! I am equipped with live database knowledge and ready to give precise recommendations." }] },
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();
        res.json({ reply });
    } catch (err) {
        console.error('Chat error:', err.message);
        res.json({ reply: getFallbackResponse(req.body.message || '') });
    }
});

module.exports = router;
