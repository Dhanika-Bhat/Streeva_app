import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.requireOtp) {
                setShowOtp(true);
            } else {
                navigate(data.user.role === 'entrepreneur' ? '/dashboard' : '/marketplace');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your journey</p>
                </div>
                {showOtp ? (
                    <form onSubmit={handleOtpSubmit} className="auth-form">
                        <div className="auth-error" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', marginBottom: '16px' }}>
                            An OTP has been sent to your email to verify your identity. Check the server console logs for the Preview URL or direct OTP.
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <div className="input-group">
                            <label><Lock size={14} /> Enter 6-digit OTP</label>
                            <input type="text" className="input-field" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}
                        <div className="input-group">
                            <label><Mail size={14} /> Email</label>
                            <input type="email" className="input-field" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label><Lock size={14} /> Password</label>
                            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>
                )}
                {!showOtp && (
                    <>
                        <p className="auth-footer">
                            Don't have an account? <Link to="/register">Join Now</Link>
                        </p>
                        <p className="auth-demo">Demo: <code>demo@streeva.com</code> / <code>password123</code></p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
