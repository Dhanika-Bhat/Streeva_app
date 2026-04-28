import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, Smartphone, Lock, X, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';
import './Checkout.css';

export default function Checkout() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Custom Local Payment Gateway State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const [form, setForm] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Step 1: User hits "Pay & Place Order" -> Opens local modal
    const handleOpenPayment = (e) => {
        e.preventDefault();
        setShowPaymentModal(true);
    };

    // Step 2: User confirms payment inside the modal -> Simulates a network charge
    const processLocalPayment = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);

        // Simulate a secure bank processing delay (2 seconds)
        setTimeout(async () => {
            try {
                // Generate a fake but realistic-looking transaction ID
                const fakePaymentId = 'txn_streeva_' + Math.random().toString(36).substr(2, 9).toUpperCase();

                // Submit to backend
                await API.post('/orders', {
                    items: items.map(i => ({ product: i._id, quantity: i.quantity })),
                    shippingAddress: form,
                    paymentId: fakePaymentId
                });

                setPaymentProcessing(false);
                setShowPaymentModal(false);
                setSuccess(true);
                clearCart();
                setTimeout(() => navigate('/profile'), 3000);

            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Order creation failed');
                setPaymentProcessing(false);
            }
        }, 2000);
    };

    if (success) {
        return (
            <div className="checkout-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                    <CheckCircle size={80} color="var(--success)" />
                    <h1 style={{ marginTop: '16px' }}>Order Placed Successfully! 🎉</h1>
                    <p style={{ color: 'var(--gray-500)' }}>Your secure local payment was processed.</p>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Redirecting to your profile...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="checkout-page relative">
            <div className="container">
                <h1>Checkout</h1>
                <div className="checkout-layout">
                    
                    <form className="checkout-form card" onSubmit={handleOpenPayment}>
                        <h3>Shipping Address</h3>
                        <div className="checkout-grid">
                            <div className="input-group" style={{ gridColumn: '1/-1' }}>
                                <label>Full Name</label>
                                <input className="input-field" name="fullName" value={form.fullName} onChange={handleChange} required />
                            </div>
                            <div className="input-group" style={{ gridColumn: '1/-1' }}>
                                <label>Address</label>
                                <input className="input-field" name="address" placeholder="Street, Colony, Landmark" value={form.address} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>City</label>
                                <input className="input-field" name="city" value={form.city} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>State</label>
                                <input className="input-field" name="state" value={form.state} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Pincode</label>
                                <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Phone</label>
                                <input className="input-field" name="phone" value={form.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg" 
                            style={{ width: '100%', marginTop: '32px' }} 
                            disabled={loading || items.length === 0}
                        >
                            <CreditCard size={18} /> Proceed to Pay ₹{totalAmount.toLocaleString()}
                        </button>
                    </form>

                    <div className="checkout-summary card">
                        <h3>Order Summary</h3>
                        {items.map(item => (
                            <div key={item._id} className="checkout-item">
                                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100'} alt={item.name} />
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>Qty: {item.quantity}</p>
                                </div>
                                <span className="price">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span className="price">₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Local Payment Gateway Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="payment-modal-overlay">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }} 
                            className="payment-modal card"
                        >
                            <div className="payment-modal-header">
                                <h3><Lock size={18} /> Streeva Secure Pay</h3>
                                {!paymentProcessing && (
                                    <button className="close-btn" onClick={() => setShowPaymentModal(false)}><X size={20} /></button>
                                )}
                            </div>
                            
                            <div className="payment-modal-amount">
                                <span>Amount to Pay</span>
                                <h2>₹{totalAmount.toLocaleString()}</h2>
                            </div>

                            <form onSubmit={processLocalPayment} className="payment-modal-body">
                                <div className="payment-methods">
                                    <div 
                                        className={`payment-method-box ${paymentMethod === 'upi' ? 'active' : ''}`}
                                        onClick={() => !paymentProcessing && setPaymentMethod('upi')}
                                    >
                                        <Smartphone size={24} />
                                        <span>UPI</span>
                                    </div>
                                    <div 
                                        className={`payment-method-box ${paymentMethod === 'card' ? 'active' : ''}`}
                                        onClick={() => !paymentProcessing && setPaymentMethod('card')}
                                    >
                                        <CreditCard size={24} />
                                        <span>Card</span>
                                    </div>
                                </div>

                                {paymentMethod === 'upi' ? (
                                    <div className="input-group" style={{ marginTop: '24px' }}>
                                        <label>UPI ID</label>
                                        <input className="input-field" placeholder="test@ybl" required disabled={paymentProcessing} />
                                    </div>
                                ) : (
                                    <div className="input-group" style={{ marginTop: '24px' }}>
                                        <label>Card Number</label>
                                        <input className="input-field" placeholder="4111 1111 1111 1111" maxLength="16" required disabled={paymentProcessing} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                            <input className="input-field" placeholder="MM/YY" required disabled={paymentProcessing} />
                                            <input className="input-field" placeholder="CVV" type="password" maxLength="3" required disabled={paymentProcessing} />
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg" 
                                    style={{ width: '100%', marginTop: '32px' }}
                                    disabled={paymentProcessing}
                                >
                                    {paymentProcessing ? (
                                        <><Loader2 className="spinner-icon" size={18} /> Processing Payment...</>
                                    ) : (
                                        `Confirm Payment`
                                    )}
                                </button>
                                <p className="secure-badge"><Lock size={12} /> Completely Local & Artificial Test Gateway</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
