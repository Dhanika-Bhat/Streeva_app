import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="brand-icon">S</div>
                            <span>Streeva</span>
                        </div>
                        <p>Empowering women entrepreneurs with a digital platform to showcase, sell, and grow their businesses.</p>
                        <div className="footer-social">
                            <a href="#" aria-label="Twitter">𝕏</a>
                            <a href="#" aria-label="Instagram">📷</a>
                            <a href="#" aria-label="LinkedIn">in</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/marketplace">Marketplace</Link>
                        <Link to="/map">Find Stores</Link>
                        <Link to="/register">Join as Entrepreneur</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Categories</h4>
                        <Link to="/marketplace?category=clothing">Clothing</Link>
                        <Link to="/marketplace?category=jewelry">Jewelry</Link>
                        <Link to="/marketplace?category=food">Food</Link>
                        <Link to="/marketplace?category=beauty">Beauty</Link>
                        <Link to="/marketplace?category=handicrafts">Handicrafts</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href="mailto:hello@streeva.com"><Mail size={14} /> hello@streeva.com</a>
                        <a href="tel:+919876543210"><Phone size={14} /> +91-9876543210</a>
                        <a href="#"><MapPin size={14} /> India</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Streeva. Made with <Heart size={14} className="heart" /> for women entrepreneurs.</p>
                </div>
            </div>
        </footer>
    );
}
