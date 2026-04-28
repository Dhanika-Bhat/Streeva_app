import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
    const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="cart-page empty-cart">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                    <ShoppingBag size={64} color="var(--gray-300)" />
                    <h2>Your cart is empty</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>Discover products from amazing women entrepreneurs!</p>
                    <Link to="/marketplace" className="btn btn-primary btn-lg">Browse Marketplace <ArrowRight size={18} /></Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>
                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item, i) => (
                            <motion.div key={item._id} className="cart-item card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'} alt={item.name} />
                                <div className="cart-item-info">
                                    <Link to={`/product/${item._id}`}><h3>{item.name}</h3></Link>
                                    <p className="price">₹{item.price?.toLocaleString()}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={14} /></button>
                                    </div>
                                    <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    <button className="cart-remove" onClick={() => removeItem(item._id)}><Trash2 size={16} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({items.length} items)</span>
                            <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span style={{ color: 'var(--success)' }}>FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span className="price">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }}
                            onClick={() => user ? navigate('/checkout') : navigate('/login')}>
                            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '8px' }} onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
