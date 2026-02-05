import React, { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                toast.success(`Increased ${item.name} quantity`);
                return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            toast.success(`Added ${item.name} to cart`);
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => {
            const item = prev.find(i => i.id === id);
            if (item) toast.error(`Removed ${item.name} from cart`);
            return prev.filter((i) => i.id !== id);
        });
    };

    const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
