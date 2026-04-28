import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Minus, Plus, Store, Star, Package } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        API.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div style={{ paddingTop: '120px' }}><div className="spinner"></div></div>;
    if (!product) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Product not found</h2></div>;

    return (
        <div className="product-detail-page">
            <div className="container">
                <Link to="/marketplace" className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}><ArrowLeft size={16} /> Back to Marketplace</Link>

                <motion.div className="product-detail-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="product-image-section">
                        <div className="product-main-image">
                            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-info-section">
                        {product.store && (
                            <Link to={`/store/${product.store._id}`} className="product-store-link">
                                <Store size={14} /> {product.store.name}
                            </Link>
                        )}
                        <h1>{product.name}</h1>
                        <div className="product-price-row">
                            <span className="price" style={{ fontSize: '1.8rem' }}>₹{product.price?.toLocaleString()}</span>
                            <span className="badge badge-crimson">{product.category}</span>
                        </div>
                        <p className="product-description">{product.description}</p>

                        <div className="product-stock">
                            <Package size={16} />
                            {product.stock > 0 ? (
                                <span style={{ color: 'var(--success)' }}>In Stock ({product.stock} available)</span>
                            ) : (
                                <span style={{ color: 'var(--error)' }}>Out of Stock</span>
                            )}
                        </div>

                        <div className="product-actions">
                            <div className="quantity-control">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
                            </div>
                            <button className={`btn ${added ? 'btn-dark' : 'btn-primary'} btn-lg`} onClick={handleAddToCart} disabled={product.stock === 0} style={{ flex: 1 }}>
                                {added ? '✓ Added to Cart!' : <><ShoppingCart size={18} /> Add to Cart</>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
