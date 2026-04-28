import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, Mail, Calendar } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        API.get('/orders/my')
            .then(res => setOrders(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    const handleLogout = () => { logout(); navigate('/'); };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="profile-card card">
                        <div className="profile-avatar">
                            <User size={32} />
                        </div>
                        <h1>{user.name}</h1>
                        <p className="profile-email"><Mail size={14} /> {user.email}</p>
                        <span className="badge badge-crimson" style={{ marginBottom: '16px' }}>{user.role}</span>
                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}><LogOut size={14} /> Logout</button>
                    </div>

                    <div className="profile-orders">
                        <h2><Package size={20} /> Order History</h2>
                        {loading ? <div className="spinner"></div> : orders.length === 0 ? (
                            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--gray-400)' }}>No orders yet.</p>
                                <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>Start Shopping</Link>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} className="card order-card">
                                    <div className="order-header">
                                        <div>
                                            <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                                            <span className="order-date"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <span className={`order-status status-${order.status}`}>{order.status}</span>
                                    </div>
                                    <div className="order-items-list">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="order-item-row">
                                                <img src={item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100'} alt={item.name} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Qty: {item.quantity}</p>
                                                </div>
                                                <span className="price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Tracking Progress */}
                                    <div className="order-tracking">
                                        {['pending', 'confirmed', 'shipped', 'delivered'].map((step, idx, arr) => {
                                            const isActive = arr.indexOf(order.status) >= idx || (order.status === 'cancelled' && idx === 0);
                                            return (
                                                <div key={step} className={`tracking-step ${isActive ? 'active' : ''}`}>
                                                    <div className="tracking-dot"></div>
                                                    <span className="tracking-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                                                    {idx < arr.length - 1 && <div className="tracking-line"></div>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="order-total">
                                        <span>Total</span>
                                        <span className="price">₹{order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
