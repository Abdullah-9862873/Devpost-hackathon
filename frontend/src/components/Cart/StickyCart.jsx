import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import './StickyCart.css';

export const StickyCart = () => {
    const { cartCount, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartCount === 0) return null;

    return (
        <div className="sticky-cart-container" onClick={() => navigate('/cart')}>
            <div className="sticky-cart-btn btn-primary">
                <div className="cart-info">
                    <ShoppingCart size={20} />
                    <span>View Cart ({cartCount} items)</span>
                </div>
                <span className="cart-price">${cartTotal.toFixed(2)}</span>
            </div>
        </div>
    );
};
