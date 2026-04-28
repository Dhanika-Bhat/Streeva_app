import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './StoreDetail.css';

export default function StoreDetail() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        API.get(`/stores/${id}`)
            .then(res => { setStore(res.data.store); setProducts(res.data.products); })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = (product) => {
        addItem(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    if (loading) return <div style={{ paddingTop: '120px' }}><div className="spinner"></div></div>;
    if (!store) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Store not found</h2><Link to="/marketplace" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Marketplace</Link></div>;

    return (
        <div className="store-detail-page">
            <div className="store-banner" style={{ backgroundImage: `url(${store.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200'})` }}>
                <div className="store-banner-overlay">
                    <div className="container">
                        <Link to="/marketplace" className="btn btn-sm back-link"><ArrowLeft size={16} /> Back</Link>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h1>{store.name}</h1>
                                {store.isVerified && <span className="badge badge-success"><CheckCircle size={12} /> Verified</span>}
                            </div>
                            <p className="store-desc">{store.description}</p>
                            <div className="store-meta">
                                <span className="stars"><Star size={16} fill="currentColor" /> {store.rating} ({store.totalRatings} reviews)</span>
                                <span><MapPin size={14} /> {store.address}</span>
                                {store.phone && <span><Phone size={14} /> {store.phone}</span>}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container section">
                <h2 style={{ marginBottom: '24px' }}>Products ({products.length})</h2>
                {products.length === 0 ? (
                    <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '40px' }}>No products listed yet.</p>
                ) : (
                    <div className="grid grid-4">
                        {products.map((product, i) => (
                            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <div className="card product-card">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="product-card-img">
                                            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'} alt={product.name} />
                                        </div>
                                    </Link>
                                    <div className="product-card-body">
                                        <Link to={`/product/${product._id}`}><h4>{product.name}</h4></Link>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="price">₹{product.price?.toLocaleString()}</span>
                                            <button className={`btn btn-sm ${addedId === product._id ? 'btn-dark' : 'btn-primary'}`} onClick={() => handleAddToCart(product)}>
                                                {addedId === product._id ? '✓ Added' : <><ShoppingCart size={14} /> Add</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
