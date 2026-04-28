import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Package, ShoppingBag, Plus, Edit2, Trash2, Eye, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: 'other', stock: '', images: [''] });
    const [storeForm, setStoreForm] = useState({ name: '', description: '', category: 'other', address: '', phone: '', lat: '', lng: '' });
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!user || user.role !== 'entrepreneur') { navigate('/'); return; }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const storeRes = await API.get('/stores');
            const myStore = storeRes.data.find(s => s.owner?._id === user.id || s.owner === user.id);
            if (myStore) {
                setStore(myStore);
                const [prodRes, orderRes] = await Promise.all([
                    API.get(`/products?store=${myStore._id}`),
                    API.get(`/orders/store/${myStore._id}`),
                ]);
                setProducts(prodRes.data);
                setOrders(orderRes.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/stores', storeForm);
            setStore(res.data);
            setShowStoreForm(false);
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await API.post('/products', { ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) });
            setShowProductForm(false);
            setProductForm({ name: '', description: '', price: '', category: 'other', stock: '', images: [''] });
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await API.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) { alert('Error deleting'); }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) { alert('Error updating'); }
    };

    if (loading) return <div style={{ paddingTop: '120px' }}><div className="spinner"></div></div>;

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, {user?.name}! 👋</p>
                    </div>
                    {store && <button className="btn btn-primary" onClick={() => { setShowProductForm(true); setActiveTab('products'); }}><Plus size={16} /> Add Product</button>}
                </div>

                {!store ? (
                    <motion.div className="create-store-prompt card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {!showStoreForm ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Store size={48} color="var(--crimson)" />
                                <h2 style={{ marginTop: '16px' }}>Create Your Store</h2>
                                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>Set up your business profile to start listing products</p>
                                <button className="btn btn-primary btn-lg" onClick={() => setShowStoreForm(true)}><Plus size={18} /> Create Store</button>
                            </div>
                        ) : (
                            <form className="store-form" onSubmit={handleCreateStore}>
                                <h3>Store Details</h3>
                                <div className="form-grid">
                                    <div className="input-group"><label>Store Name</label><input className="input-field" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required /></div>
                                    <div className="input-group"><label>Category</label>
                                        <select className="input-field" value={storeForm.category} onChange={e => setStoreForm({ ...storeForm, category: e.target.value })}>
                                            {['handicrafts', 'food', 'clothing', 'beauty', 'jewelry', 'home-decor', 'art', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea className="input-field" rows={3} value={storeForm.description} onChange={e => setStoreForm({ ...storeForm, description: e.target.value })} /></div>
                                    <div className="input-group"><label>Address</label><input className="input-field" value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} /></div>
                                    <div className="input-group"><label>Phone</label><input className="input-field" value={storeForm.phone} onChange={e => setStoreForm({ ...storeForm, phone: e.target.value })} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">Create Store</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowStoreForm(false)}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="dashboard-stats">
                            <div className="dash-stat"><div className="dash-stat-icon" style={{ background: 'rgba(220,20,60,0.1)', color: 'var(--crimson)' }}><Package size={20} /></div><div><span className="dash-stat-value">{products.length}</span><span className="dash-stat-label">Products</span></div></div>
                            <div className="dash-stat"><div className="dash-stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}><DollarSign size={20} /></div><div><span className="dash-stat-value">₹{totalRevenue.toLocaleString()}</span><span className="dash-stat-label">Revenue</span></div></div>
                            <div className="dash-stat"><div className="dash-stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--info)' }}><ShoppingBag size={20} /></div><div><span className="dash-stat-value">{orders.length}</span><span className="dash-stat-label">Orders</span></div></div>
                            <div className="dash-stat"><div className="dash-stat-icon" style={{ background: 'rgba(212,160,23,0.1)', color: 'var(--gold)' }}><TrendingUp size={20} /></div><div><span className="dash-stat-value">{store.rating}</span><span className="dash-stat-label">Rating</span></div></div>
                        </div>

                        {/* Tabs */}
                        <div className="dashboard-tabs">
                            {['overview', 'products', 'orders'].map(tab => (
                                <button key={tab} className={`dash-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                            ))}
                        </div>

                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div>
                                {showProductForm && (
                                    <motion.form className="card" style={{ padding: '24px', marginBottom: '24px' }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleCreateProduct}>
                                        <h3 style={{ marginBottom: '16px' }}>New Product</h3>
                                        <div className="form-grid">
                                            <div className="input-group"><label>Name</label><input className="input-field" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                                            <div className="input-group"><label>Price (₹)</label><input className="input-field" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required /></div>
                                            <div className="input-group"><label>Category</label>
                                                <select className="input-field" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                                    {['handicrafts', 'food', 'clothing', 'beauty', 'jewelry', 'home-decor', 'art', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="input-group"><label>Stock</label><input className="input-field" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required /></div>
                                            <div className="input-group" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea className="input-field" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} /></div>
                                            <div className="input-group" style={{ gridColumn: '1/-1' }}><label>Image URL</label><input className="input-field" value={productForm.images[0]} onChange={e => setProductForm({ ...productForm, images: [e.target.value] })} placeholder="https://..." /></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                            <button type="submit" className="btn btn-primary">Add Product</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowProductForm(false)}>Cancel</button>
                                        </div>
                                    </motion.form>
                                )}
                                <div className="dashboard-product-list">
                                    {products.map(p => (
                                        <div key={p._id} className="card dash-product-item">
                                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'} alt={p.name} />
                                            <div className="dash-product-info">
                                                <h4>{p.name}</h4>
                                                <p className="price">₹{p.price?.toLocaleString()}</p>
                                                <span className="badge badge-crimson">{p.category}</span>
                                            </div>
                                            <div className="dash-product-actions">
                                                <span>Stock: {p.stock}</span>
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteProduct(p._id)}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="dashboard-orders">
                                {orders.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '40px' }}>No orders yet.</p>
                                ) : orders.map(order => (
                                    <div key={order._id} className="card dash-order-item">
                                        <div className="dash-order-header">
                                            <div>
                                                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                                                <span className="dash-order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <select value={order.status} onChange={e => handleUpdateOrderStatus(order._id, e.target.value)} className="status-select">
                                                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="dash-order-items">
                                            {order.items?.map((item, i) => (
                                                <div key={i} className="dash-order-product">
                                                    <span>{item.name} × {item.quantity}</span>
                                                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="dash-order-footer">
                                            <span>Customer: {order.customer?.name || 'N/A'}</span>
                                            <span className="price">Total: ₹{order.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="card" style={{ padding: '28px' }}>
                                <h3 style={{ marginBottom: '16px' }}>Store Info</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><strong>Name:</strong> {store.name}</div>
                                    <div><strong>Category:</strong> {store.category}</div>
                                    <div><strong>Address:</strong> {store.address || 'Not set'}</div>
                                    <div><strong>Phone:</strong> {store.phone || 'Not set'}</div>
                                    <div style={{ gridColumn: '1/-1' }}><strong>Description:</strong> {store.description || 'No description'}</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
