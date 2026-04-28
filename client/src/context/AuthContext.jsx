import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: `${API_BASE.replace(/\/$/, '')}/api` });

// Attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('streeva_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('streeva_token');
        if (token) {
            API.get('/auth/me')
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('streeva_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        if (res.data.token && res.data.user) {
            localStorage.setItem('streeva_token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await API.post('/auth/register', { name, email, password, role });
        if (res.data.token && res.data.user) {
            localStorage.setItem('streeva_token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const verifyOtp = async (email, otp) => {
        const res = await API.post('/auth/verify-otp', { email, otp });
        if (res.data.token && res.data.user) {
            localStorage.setItem('streeva_token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('streeva_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout, API }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export { API };
