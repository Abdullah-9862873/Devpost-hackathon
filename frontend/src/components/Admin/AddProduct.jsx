import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './AddProduct.css';

export const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'pizza',
        description: '',
        discount: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const categories = ['pizza', 'pasta', 'traditionals', 'desserts', 'deals'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0
            };

            await axios.post('/api/menu', dataToSubmit);
            toast.success('Product added successfully!');
            navigate('/admin/manage');
        } catch (err) {
            console.error(err);
            setError('Failed to add product. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="view-header">
                <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={20} /> Back</button>
                <h1 className="view-title">Add New Product</h1>
            </div>

            <div className="glass-morphism form-container">
                <div className="form-icon">
                    <PackagePlus size={40} />
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Spicy Tikka Pizza"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="14.99"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Discount (%)</label>
                        <input
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            placeholder="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the deliciousness..."
                        />
                    </div>

                    <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                        {loading ? 'Adding...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};
