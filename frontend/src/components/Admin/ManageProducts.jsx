import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ManageProducts.css';

export const ManageProducts = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/menu');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

        try {
            await axios.delete(`/api/menu/${id}`);
            setItems(items.filter(item => item._id !== id));
            toast.success('Product deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="admin-page">
            <div className="view-header">
                <div className="header-left">
                    <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={20} /> Back</button>
                    <h1 className="view-title">Manage Products</h1>
                </div>
                <button className="refresh-btn" onClick={fetchItems}>
                    <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                </button>
            </div>

            <div className="manage-list">
                {loading ? (
                    <div className="loader-container"><div className="loader" /></div>
                ) : items.length === 0 ? (
                    <div className="glass-morphism empty-manage">
                        <p>No products found in the database.</p>
                        <button className="btn-primary" onClick={() => navigate('/admin/add')}>Add First Product</button>
                    </div>
                ) : (
                    <div className="admin-table-container glass-morphism">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="item-name-cell">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-desc">{item.description.substring(0, 40)}...</span>
                                            </div>
                                        </td>
                                        <td><span className="cat-badge">{item.category}</span></td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <button className="delete-action-btn" onClick={() => handleDelete(item._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
