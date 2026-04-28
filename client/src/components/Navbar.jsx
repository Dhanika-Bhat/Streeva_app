import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar glass">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    <div className="brand-icon">S</div>
                    <span>Streeva</span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link>
                    <Link to="/map" onClick={() => setMenuOpen(false)}>Map</Link>
                    <Link to="/blog" onClick={() => setMenuOpen(false)}>Stories</Link>

                    <div className="navbar-actions-mobile">
                        {user ? (
                            <>
                                {user.role === 'entrepreneur' && (
                                    <Link to="/dashboard" className="btn btn-gold btn-sm" onClick={() => setMenuOpen(false)}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                )}
                                <Link to="/profile" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                                    <User size={16} /> {user.name}
                                </Link>
                                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Join Now</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="navbar-actions">
                    <Link to="/cart" className="cart-btn">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'entrepreneur' && (
                                <Link to="/dashboard" className="btn btn-gold btn-sm">
                                    <LayoutDashboard size={16} /> Dashboard
                                </Link>
                            )}
                            <Link to="/profile" className="btn btn-secondary btn-sm">
                                <User size={16} /> {user.name?.split(' ')[0]}
                            </Link>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
                        </>
                    )}
                </div>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
