import React from 'react';
import { NavLink } from 'react-router-dom';
import { Pizza, Coffee, GlassWater, Percent, Home, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
    const links = [
        { to: '/', icon: <Home size={20} />, label: 'Home' },
        { to: '/category/pizza', icon: <Pizza size={20} />, label: 'Pizza' },
        { to: '/category/pasta', icon: <UtensilsCrossed size={20} />, label: 'Pasta' },
        { to: '/category/traditionals', icon: <UtensilsCrossed size={20} />, label: 'Traditionals' },
        { to: '/category/desserts', icon: <Coffee size={20} />, label: 'Desserts' },
        { to: '/category/beverages', icon: <GlassWater size={20} />, label: 'Beverages' },
        { to: '/category/deals', icon: <Percent size={20} />, label: 'Deals' },
    ];

    return (
        <div className="sidebar glass-morphism">
            <div className="sidebar-header">
                <h1 className="logo">Voice<span>Bite</span></h1>
            </div>
            <nav className="nav-links">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="admin-section">
                    <span className="section-label">Administration</span>
                    <NavLink to="/admin/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <UtensilsCrossed size={18} />
                        <span>Add Product</span>
                    </NavLink>
                    <NavLink to="/admin/manage" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <UtensilsCrossed size={18} />
                        <span>Manage Items</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};
