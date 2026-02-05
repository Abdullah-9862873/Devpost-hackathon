import React from 'react';
import { useCart } from '../../lib/CartContext';
import './ProductCard.css';

export const ProductCard = ({ item, onDelete }) => {
    const { addToCart } = useCart();

    return (
        <div className="glass-morphism product-card">
            <div className="card-header">
                <span className="category">{item.category}</span>
                {item.discount && <span className="badge-discount">-{item.discount}%</span>}
            </div>
            <h3 className="name">{item.name}</h3>
            <p className="description">{item.description}</p>
            <div className="card-footer">
                <span className="price">${item.price.toFixed(2)}</span>
                <button
                    className="btn-primary"
                    onClick={() => addToCart(item)}
                >
                    Add
                </button>
            </div>
        </div>
    );
};
