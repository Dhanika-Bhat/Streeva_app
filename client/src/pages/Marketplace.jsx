import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, ShoppingCart } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Marketplace.css';

const CATEGORIES = ['all', 'clothing', 'jewelry', 'food', 'beauty', 'art', 'home-decor', 'handicrafts'];

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';
    const [view, setView] = useState('products'); // products | stores
    const { addItem } = useCart();
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {};
                if (activeCategory !== 'all') params.category = activeCategory;
                if (search) params.search = search;

                const [prodRes, storeRes] = await Promise.all([
                    API.get('/products', { params }),
                    API.get('/stores', { params: { category: activeCategory !== 'all' ? activeCategory : undefined, search } }),
                ]);
                setProducts(prodRes.data);
                setStores(storeRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategory, search]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="marketplace-page">
            <div className="marketplace-hero">
                <div className="container">
                    <h1>Marketplace</h1>
                    <p>Discover unique products from women entrepreneurs across India</p>
                    <div className="marketplace-search">
                        <Search size={20} />
                        <input placeholder="Search products, stores..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="container section">
                <div className="marketplace-controls">
                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })}>
                                {cat === 'all' ? 'All' : cat.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="view-toggle">
                        <button className={view === 'products' ? 'active' : ''} onClick={() => setView('products')}>Products</button>
                        <button className={view === 'stores' ? 'active' : ''} onClick={() => setView('stores')}>Stores</button>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : view === 'products' ? (
                    <div className="grid grid-4">
                        {products.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray-400)', padding: '60px 0' }}>No products found. Try a different category or search.</p>
                        ) : products.map((product, i) => (
                            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <Link to={`/product/${product._id}`} className="card product-card">
                                    <div className="product-card-img">
                                        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'} alt={product.name} />
                                        <button className={`quick-add ${addedId === product._id ? 'added' : ''}`} onClick={e => handleAddToCart(e, product)}>
                                            {addedId === product._id ? '✓ Added' : <><ShoppingCart size={14} /> Add</>}
                                        </button>
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
                ) : (
                    <div className="grid grid-3">
                        {stores.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray-400)', padding: '60px 0' }}>No stores found.</p>
                        ) : stores.map((store, i) => (
                            <motion.div key={store._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <Link to={`/store/${store._id}`} className="card store-card">
                                    <div className="store-card-img">
                                        <img src={store.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'} alt={store.name} />
                                        {store.isVerified && <span className="verified-badge">✓ Verified</span>}
                                    </div>
                                    <div className="store-card-body">
                                        <h3>{store.name}</h3>
                                        <p className="store-card-cat">{store.category}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{store.description}</p>
                                        <div className="store-card-footer">
                                            <div className="stars"><Star size={14} fill="currentColor" /> {store.rating}</div>
                                            <span className="store-card-loc"><MapPin size={12} /> {store.address?.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
