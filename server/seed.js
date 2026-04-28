const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/streeva';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Store.deleteMany({});
        await Product.deleteMany({});

        // Create entrepreneurs
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        const entrepreneurs = await User.insertMany([
            { name: 'Priya Sharma', email: 'priya@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Anita Desai', email: 'anita@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Meera Patel', email: 'meera@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Lakshmi Iyer', email: 'lakshmi@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Fatima Khan', email: 'fatima@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Sita Reddy', email: 'sita@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Kavya Menon', email: 'kavya@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Ritu Kapoor', email: 'ritu@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Ayesha Malik', email: 'ayesha@streeva.com', password: hash, role: 'entrepreneur' },
            { name: 'Sneha Bose', email: 'sneha@streeva.com', password: hash, role: 'entrepreneur' },
        ]);

        // Create a customer
        await User.create({ name: 'Demo Customer', email: 'demo@streeva.com', password: hash, role: 'customer' });

        // Create stores with real Indian city coordinates
        const stores = await Store.insertMany([
            {
                owner: entrepreneurs[0]._id, name: "Priya's Handloom", description: 'Authentic handwoven textiles from rural artisans. Each piece carries a story of tradition.', category: 'clothing',
                address: 'Chandni Chowk, Delhi', location: { type: 'Point', coordinates: [77.2295, 28.6562] },
                coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', rating: 4.8, totalRatings: 124, isVerified: true, phone: '+91-9876543210',
            },
            {
                owner: entrepreneurs[1]._id, name: "Anita's Kitchen", description: 'Home-style pickles, masalas, and snacks made with organic ingredients and grandmother\'s recipes.', category: 'food',
                address: 'Koramangala, Bangalore', location: { type: 'Point', coordinates: [77.6224, 12.9352] },
                coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', rating: 4.9, totalRatings: 89, isVerified: true, phone: '+91-9876543211',
            },
            {
                owner: entrepreneurs[2]._id, name: "Meera's Jewel Box", description: 'Contemporary jewelry blending traditional Kundan techniques with modern minimalist designs.', category: 'jewelry',
                address: 'Bandra West, Mumbai', location: { type: 'Point', coordinates: [72.8361, 19.0596] },
                coverImage: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800', rating: 4.7, totalRatings: 67, isVerified: true, phone: '+91-9876543212',
            },
            {
                owner: entrepreneurs[3]._id, name: "Lakshmi's Naturals", description: 'Ayurvedic skincare and beauty products crafted from pure natural ingredients.', category: 'beauty',
                address: 'T Nagar, Chennai', location: { type: 'Point', coordinates: [80.2330, 13.0419] },
                coverImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', rating: 4.6, totalRatings: 45, isVerified: true, phone: '+91-9876543213',
            },
            {
                owner: entrepreneurs[4]._id, name: "Fatima's Art Studio", description: 'Hand-painted canvas art, illustrations, and custom portraits that celebrate women and culture.', category: 'art',
                address: 'Jubilee Hills, Hyderabad', location: { type: 'Point', coordinates: [78.4074, 17.4326] },
                coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', rating: 4.5, totalRatings: 38, isVerified: false, phone: '+91-9876543214',
            },
            {
                owner: entrepreneurs[5]._id, name: "Sita's Home Décor", description: 'Handcrafted home décor pieces — macramé, pottery, and upcycled furniture.', category: 'home-decor',
                address: 'Aundh, Pune', location: { type: 'Point', coordinates: [73.8074, 18.5597] },
                coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', rating: 4.4, totalRatings: 29, isVerified: false, phone: '+91-9876543215',
            },
            {
                owner: entrepreneurs[6]._id, name: "Kavya's Tech Haven", description: 'Custom-built tech accessories and beautifully crafted mechanical keyboards.', category: 'other',
                address: 'Indiranagar, Bangalore', location: { type: 'Point', coordinates: [77.6411, 12.9783] },
                coverImage: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800', rating: 4.8, totalRatings: 55, isVerified: true, phone: '+91-9876543216',
            },
            {
                owner: entrepreneurs[7]._id, name: "Ritu's Organic Farms", description: 'Fresh, pesticide-free organic vegetables and cold-pressed juices from our farm to your table.', category: 'food',
                address: 'Vasant Kunj, Delhi', location: { type: 'Point', coordinates: [77.1585, 28.5300] },
                coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', rating: 4.9, totalRatings: 110, isVerified: true, phone: '+91-9876543217',
            },
            {
                owner: entrepreneurs[8]._id, name: "Ayesha's Library", description: 'Curated collection of rare books, vintage prints, and locally bound journals.', category: 'other',
                address: 'Colaba, Mumbai', location: { type: 'Point', coordinates: [72.8336, 18.9149] },
                coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800', rating: 4.6, totalRatings: 42, isVerified: false, phone: '+91-9876543218',
            },
            {
                owner: entrepreneurs[9]._id, name: "Sneha's Clay Craft", description: 'Handcrafted terracotta pottery, decorative vases, and traditional clay cookware.', category: 'handicrafts',
                address: 'Salt Lake City, Kolkata', location: { type: 'Point', coordinates: [88.4143, 22.5862] },
                coverImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800', rating: 4.7, totalRatings: 80, isVerified: true, phone: '+91-9876543219',
            },
        ]);

        // Create products for each store
        const products = [
            // Priya's Handloom
            { store: stores[0]._id, name: 'Banarasi Silk Saree', description: 'Handwoven pure silk saree with intricate gold zari work. Perfect for weddings and festivities.', price: 4500, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'], category: 'clothing', stock: 12, isFeatured: true },
            { store: stores[0]._id, name: 'Cotton Dupatta Set', description: 'Block-printed cotton dupatta in earthy tones. Lightweight and versatile.', price: 850, images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'], category: 'clothing', stock: 25 },
            { store: stores[0]._id, name: 'Handloom Stole', description: 'Pashmina-blend handloom stole in gradient colors. Cozy yet elegant.', price: 1200, images: ['https://images.unsplash.com/photo-1601244005535-a48d12b9fa85?w=600'], category: 'clothing', stock: 18 },
            // Anita's Kitchen
            { store: stores[1]._id, name: 'Mango Pickle (500g)', description: 'Traditional aam ka achaar made with raw mangoes, mustard oil, and hand-ground spices.', price: 250, images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600'], category: 'food', stock: 50, isFeatured: true },
            { store: stores[1]._id, name: 'Masala Box (Set of 6)', description: 'Artisanal spice blend collection — Garam Masala, Chai Masala, Biryani Mix, and more.', price: 650, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'], category: 'food', stock: 30 },
            { store: stores[1]._id, name: 'Organic Honey (350ml)', description: 'Pure wild honey sourced from Karnataka forests. Unprocessed and nutrient-rich.', price: 450, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'], category: 'food', stock: 40 },
            // Meera's Jewel Box
            { store: stores[2]._id, name: 'Kundan Earrings', description: 'Statement Kundan earrings with pearl drops. Handcrafted by Jaipur artisans.', price: 1800, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'], category: 'jewelry', stock: 15, isFeatured: true },
            { store: stores[2]._id, name: 'Minimalist Gold Necklace', description: 'Delicate 22k gold-plated chain with geometric pendant. Everyday elegance.', price: 1200, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'], category: 'jewelry', stock: 20 },
            { store: stores[2]._id, name: 'Bangles Set (6 pcs)', description: 'Hand-enameled bangles in festive colors. Stackable and lightweight.', price: 950, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'], category: 'jewelry', stock: 35 },
            // Lakshmi's Naturals
            { store: stores[3]._id, name: 'Kumkumadi Face Serum', description: 'Ayurvedic glow serum with saffron, turmeric and sandalwood. For radiant skin.', price: 750, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'], category: 'beauty', stock: 60, isFeatured: true },
            { store: stores[3]._id, name: 'Herbal Hair Oil (200ml)', description: 'Bhringraj + Amla infused hair oil for strength and shine. Chemical-free formula.', price: 350, images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'], category: 'beauty', stock: 45 },
            { store: stores[3]._id, name: 'Rose Gold Lip Balm', description: 'Moisturizing tinted lip balm made with shea butter and rose extract.', price: 199, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'], category: 'beauty', stock: 80 },
            // Fatima's Art Studio
            { store: stores[4]._id, name: 'Abstract Canvas - "Rise"', description: 'Original acrylic on canvas (24x36 in). Bold strokes celebrating women\'s strength.', price: 3500, images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?w=600'], category: 'art', stock: 1, isFeatured: true },
            { store: stores[4]._id, name: 'Custom Portrait (Digital)', description: 'Personalized digital portrait from your photo. Delivered in 5 business days.', price: 1500, images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'], category: 'art', stock: 999 },
            // Sita's Home Décor
            { store: stores[5]._id, name: 'Macramé Wall Hanging', description: 'Bohemian cotton macramé in natural ivory. Adds warmth to any room.', price: 1100, images: ['https://images.unsplash.com/photo-1622539498579-43d3ae77fdb0?w=600'], category: 'home-decor', stock: 8, isFeatured: true },
            { store: stores[5]._id, name: 'Terracotta Planter Set', description: 'Hand-painted terracotta pots (set of 3). Perfect for succulents and herbs.', price: 650, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'], category: 'home-decor', stock: 22 },
            // Kavya's Tech Haven
            { store: stores[6]._id, name: 'Walnut Mechanical Keyboard', description: 'Hand-assembled mechanical keyboard with a custom walnut wood base.', price: 12500, images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=600'], category: 'other', stock: 5, isFeatured: true },
            { store: stores[6]._id, name: 'Leather Laptop Sleeve', description: 'Premium vegan leather laptop sleeve with padded interior.', price: 1800, images: ['https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600'], category: 'other', stock: 15 },
            // Ritu's Organic Farms
            { store: stores[7]._id, name: 'Organic Honey Box', description: 'Assorted pure honey jars directly sourced from forest reserves.', price: 900, images: ['https://images.unsplash.com/photo-1587049352851-8d4e89134789?w=600'], category: 'food', stock: 20, isFeatured: true },
            { store: stores[7]._id, name: 'Cold Pressed Coconut Oil', description: 'Wood-pressed pure edible coconut oil (1 Litre).', price: 650, images: ['https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=600'], category: 'food', stock: 35 },
            // Ayesha's Library
            { store: stores[8]._id, name: 'Hand-Bound Leather Journal', description: 'Vintage style hand-bound unruled journal with 200 pages.', price: 850, images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'], category: 'other', stock: 30, isFeatured: true },
            // Sneha's Clay Craft
            { store: stores[9]._id, name: 'Terracotta Water Jug', description: 'Traditional earthen jug (1.5L) that naturally cools drinking water.', price: 550, images: ['https://images.unsplash.com/photo-1610701596047-11502861dcfa?w=600'], category: 'handicrafts', stock: 25, isFeatured: true },
            { store: stores[9]._id, name: 'Clay Handi Cookware', description: 'Unglazed clay pot perfect for slow-cooking curries and biryanis.', price: 850, images: ['https://images.unsplash.com/photo-1510265236892-381c15c8e3cc?w=600'], category: 'handicrafts', stock: 12 },
        ];

        await Product.insertMany(products);

        console.log('✅ Database seeded successfully!');
        console.log(`   ${entrepreneurs.length} entrepreneurs created`);
        console.log(`   ${stores.length} stores created`);
        console.log(`   ${products.length} products created`);
        console.log('   1 demo customer created (demo@streeva.com / password123)');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
};

seedData();
