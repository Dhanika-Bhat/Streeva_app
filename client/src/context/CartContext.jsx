import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('streeva_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('streeva_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product) => {
        setItems(prev => {
            const existing = prev.find(i => i._id === product._id);
            if (existing) {
                return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeItem = (productId) => {
        setItems(prev => prev.filter(i => i._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeItem(productId);
        setItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
