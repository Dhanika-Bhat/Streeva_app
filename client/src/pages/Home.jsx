import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Store, Users, ShoppingBag, MapPin, Star, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { API } from '../context/AuthContext';
import './Home.css';

const STATS = [
    { icon: <Store size={24} />, value: '500+', label: 'Women-Owned Stores' },
    { icon: <ShoppingBag size={24} />, value: '10,000+', label: 'Products Listed' },
    { icon: <Users size={24} />, value: '50,000+', label: 'Happy Customers' },
    { icon: <MapPin size={24} />, value: '100+', label: 'Cities Covered' },
];

const CATEGORIES = [
    { name: 'Clothing', emoji: '👗', color: '#FF6B6B' },
    { name: 'Jewelry', emoji: '💍', color: '#D4A017' },
    { name: 'Food', emoji: '🍯', color: '#22C55E' },
    { name: 'Beauty', emoji: '✨', color: '#E91E8B' },
    { name: 'Art', emoji: '🎨', color: '#3B82F6' },
    { name: 'Home Décor', emoji: '🏠', color: '#8B5CF6' },
    { name: 'Handicrafts', emoji: '🧶', color: '#F59E0B' },
    { name: 'Other', emoji: '🎁', color: '#6B7280' },
];

const INSPIRING_STORIES = [
    {
        name: "Falguni Nayar",
        title: "Founder, Nykaa",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        story: "Started Nykaa at age 50, building it into India's largest omnichannel beauty destination and becoming a self-made billionaire.",
        link: "https://en.wikipedia.org/wiki/Falguni_Nayar"
    },
    {
        name: "Kiran Mazumdar-Shaw",
        title: "Founder, Biocon",
        image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400",
        story: "Pioneered the biotech industry in India. Started from a garage to build an enterprise that delivers affordable life-saving medicines globally.",
        link: "https://en.wikipedia.org/wiki/Kiran_Mazumdar-Shaw"
    },
    {
        name: "Vani Kola",
        title: "Founder, Kalaari Capital",
        image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=400",
        story: "A visionary venture capitalist who has backed and mentored some of India's most successful startups and female entrepreneurs.",
        link: "https://en.wikipedia.org/wiki/Vani_Kola"
    }
];

const TESTIMONIALS = [
    { name: 'Ritu Verma', role: 'Customer', text: 'Streeva helped me discover amazing local artisans. The quality of handwoven textiles I found here is unmatched!', rating: 5 },
    { name: 'Sunita Devi', role: 'Entrepreneur', text: 'My pickle business grew 3x after joining Streeva. The platform is so easy to use, even my mother helps manage orders!', rating: 5 },
    { name: 'Kavya Nair', role: 'Customer', text: 'I love the map feature — found a beautiful jewelry store just 2 km from home that I never knew existed.', rating: 5 },
];

export default function Home() {
    const [featuredStores, setFeaturedStores] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        API.get('/stores').then(res => setFeaturedStores(res.data.slice(0, 4))).catch(() => { });
        API.get('/products?featured=true&limit=8').then(res => setFeaturedProducts(res.data)).catch(() => { });
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container hero-content">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="badge badge-gold hero-badge">
                            <Sparkles size={14} /> Empowering Women Entrepreneurs
                        </span>
                        <h1>Bold Women.<br /><span className="gold-text">Bold Businesses.</span></h1>
                        <p className="hero-desc">
                            Discover, support, and celebrate women-owned businesses in your community. Together, we rise.
                        </p>
                        <div className="hero-btns">
                            <Link to="/marketplace" className="btn btn-primary btn-lg">
                                Explore Businesses <ArrowRight size={18} />
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-lg">
                                Join as Entrepreneur
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((stat, i) => (
                            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="stat-icon">{stat.icon}</div>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by <span className="accent">Category</span></h2>
                        <p>Explore diverse products crafted by talented women across India</p>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                <Link to={`/marketplace?category=${cat.name.toLowerCase().replace(/\s|é/g, c => c === 'é' ? 'e' : '-')}`} className="category-card" style={{ '--cat-color': cat.color }}>
                                    <span className="category-emoji">{cat.emoji}</span>
                                    <span className="category-name">{cat.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Stores */}
            {featuredStores.length > 0 && (
                <section className="section" style={{ background: 'var(--gray-50)' }}>
                    <div className="container">
                        <div className="section-header">
                            <h2>Featured <span className="accent">Stores</span></h2>
                            <p>Meet the inspiring women behind these thriving businesses</p>
                        </div>
                        <div className="grid grid-4">
                            {featuredStores.map((store, i) => (
                                <motion.div key={store._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Link to={`/store/${store._id}`} className="card store-card">
                                        <div className="store-card-img">
                                            <img src={store.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'} alt={store.name} />
                                            {store.isVerified && <span className="verified-badge">✓ Verified</span>}
                                        </div>
                                        <div className="store-card-body">
                                            <h3>{store.name}</h3>
                                            <p className="store-card-cat">{store.category}</p>
                                            <div className="store-card-footer">
                                                <div className="stars">
                                                    <Star size={14} fill="currentColor" /> {store.rating}
                                                </div>
                                                <span className="store-card-loc"><MapPin size={12} /> {store.address?.split(',')[0]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Link to="/marketplace" className="btn btn-secondary">View All Stores <ArrowRight size={16} /></Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Trending <span className="accent">Products</span></h2>
                            <p>Handpicked favorites from our community</p>
                        </div>
                        <div className="grid grid-4">
                            {featuredProducts.slice(0, 4).map((product, i) => (
                                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Link to={`/product/${product._id}`} className="card product-card">
                                        <div className="product-card-img">
                                            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'} alt={product.name} />
                                        </div>
                                        <div className="product-card-body">
                                            <p className="product-card-store">{product.store?.name}</p>
                                            <h4>{product.name}</h4>
                                            <span className="price">₹{product.price?.toLocaleString()}</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How it works */}
            <section className="section how-section">
                <div className="container">
                    <div className="section-header">
                        <h2>How <span className="accent">Streeva</span> Works</h2>
                        <p>Three simple steps to support women entrepreneurs</p>
                    </div>
                    <div className="grid grid-3">
                        {[
                            { icon: <MapPin size={32} />, title: 'Discover Nearby', desc: 'Use our interactive map to find women-owned stores in your area' },
                            { icon: <ShoppingBag size={32} />, title: 'Shop & Support', desc: 'Browse unique products and add your favorites to cart' },
                            { icon: <Heart size={32} />, title: 'Make an Impact', desc: 'Every purchase directly supports a woman entrepreneur\'s dream' },
                        ].map((step, i) => (
                            <motion.div key={i} className="how-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                                <div className="how-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section" style={{ background: 'var(--dark)', color: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 style={{ color: 'white' }}>What People <span className="gold-text">Say</span></h2>
                        <p style={{ color: 'var(--gray-400)' }}>Real stories from our amazing community</p>
                    </div>
                    <div className="grid grid-3">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={i} className="testimonial-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="stars" style={{ marginBottom: '12px' }}>
                                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p>"{t.text}"</p>
                                <div className="testimonial-author">
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to <span className="gold-text">Make a Difference</span>?</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            Whether you're an entrepreneur ready to grow or a shopper wanting to support local, Streeva is your platform.
                        </p>
                        <div className="hero-btns" style={{ justifyContent: 'center' }}>
                            <Link to="/register" className="btn btn-primary btn-lg"><TrendingUp size={18} /> Start Selling</Link>
                            <Link to="/marketplace" className="btn btn-gold btn-lg"><ShoppingBag size={18} /> Start Shopping</Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
