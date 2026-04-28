import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await register(name, email, password, role);
            if (data.requireOtp) {
                setShowOtp(true);
            } else {
                navigate(data.user.role === 'entrepreneur' ? '/dashboard' : '/marketplace');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await verifyOtp(email, otp);
            navigate(data.user.role === 'entrepreneur' ? '/dashboard' : '/marketplace');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div className="auth-card card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="auth-header">
                    <h1>Join Streeva</h1>
                    <p>Start your journey of empowerment</p>
                </div>
                {showOtp ? (
                    <form onSubmit={handleOtpSubmit} className="auth-form">
                        <div className="auth-error" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', marginBottom: '16px' }}>
                            An OTP has been sent to your email. Check your inbox (or the server console terminal for test preview URLs).
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <div className="input-group">
                            <label><Lock size={14} /> Enter 6-digit OTP</label>
                            <input type="text" className="input-field" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Verifying...' : 'Complete Registration'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}

                        <div className="role-picker">
                            <button type="button" className={`role-option ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>
                                <User size={20} />
                                <span>Customer</span>
                                <small>Shop & support</small>
                            </button>
                            <button type="button" className={`role-option ${role === 'entrepreneur' ? 'active' : ''}`} onClick={() => setRole('entrepreneur')}>
                                <Store size={20} />
                                <span>Entrepreneur</span>
                                <small>Sell & grow</small>
                            </button>
                        </div>

                        <div className="input-group">
                            <label><User size={14} /> Full Name</label>
                            <input type="text" className="input-field" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label><Mail size={14} /> Email</label>
                            <input type="email" className="input-field" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label><Lock size={14} /> Password</label>
                            <input type="password" className="input-field" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
                        </button>
                    </form>
                )}
                {!showOtp && (
                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
}
