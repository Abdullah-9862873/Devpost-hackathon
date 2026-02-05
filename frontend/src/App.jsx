import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Sidebar } from './components/Navigation/Sidebar';
import { ProductCard } from './components/Menu/ProductCard';
import { StickyCart } from './components/Cart/StickyCart';
import { CartProvider, useCart } from './lib/CartContext';
import { Trash2, ArrowLeft, Mic, MicOff, ShoppingCart } from 'lucide-react';
import { AddProduct } from './components/Admin/AddProduct';
import { ManageProducts } from './components/Admin/ManageProducts';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

// Main Orchestrator Component
function AppContent() {
    const { isListening, transcript, startListening } = useSpeechRecognition();
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('/api/menu');
                setAllMenuItems(res.data);
                setFeaturedItems(res.data.slice(0, 6)); // Show first 6 as featured
            } catch (err) {
                console.error(err);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (!isListening && transcript) {
            handleVoiceCommand(transcript);
        }
    }, [isListening, transcript]);

    const handleVoiceCommand = async (transcript) => {
        setNotification(`AI Processing: "${transcript}"...`);

        try {
            const response = await axios.post('/api/ai/process-command', { transcript });
            const { action, payload } = response.data;

            // Perform the action
            if (action === 'GET_CATEGORY') navigate(`/category/${payload.category}`);
            if (action === 'NAVIGATE') navigate(payload.page === 'home' ? '/' : `/${payload.page}`);
            if (action === 'SEARCH') navigate(`/search?q=${payload.query}`);
            if (action === 'ADD_TO_CART') {
                const itemName = (payload.name || "").toLowerCase();
                const item = allMenuItems.find(i =>
                    i.name.toLowerCase().includes(itemName) ||
                    itemName.includes(i.name.toLowerCase())
                );

                if (item) {
                    addToCart(item);
                    // toast is already handled inside addToCart in CartContext
                } else {
                    toast.error(`Sorry, I couldn't find "${payload.name || 'that item'}" in our menu.`);
                }
            }

        } catch (error) {
            console.error("Voice AI failed", error);
            toast.error("I couldn't understand that command.");
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <div className="top-bar">
                    <div className="voice-control glass-morphism">
                        <button
                            className={`mic-btn ${isListening ? 'listening' : ''}`}
                            onClick={startListening}
                        >
                            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>
                        <div className="voice-status">
                            {isListening ? (
                                <span className="transcript">"{transcript}"</span>
                            ) : (
                                <span className="placeholder">{notification || "Tap mic to speak..."}</span>
                            )}
                        </div>
                        {isLoading && <div className="loading-spinner" />}
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<MenuView items={featuredItems} title="Recommended for You" />} />
                    <Route path="/category/:category" element={<CategoryView />} />
                    <Route path="/search" element={<SearchView />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/admin/add" element={<AddProduct />} />
                    <Route path="/admin/manage" element={<ManageProducts />} />
                </Routes>
            </main>
            <StickyCart />
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                }
            }} />
        </div>
    );
}

const MenuView = ({ items, title }) => (
    <section className="view-section">
        <div className="view-header">
            <h2 className="view-title">{title}</h2>
            <p className="item-count">{items.length} dishes found</p>
        </div>
        <div className="product-grid">
            {items.length > 0 ? (
                items.map(item => <ProductCard key={item._id || item.id} item={item} />)
            ) : (
                <div className="no-results">
                    <p>No items found. Try a different search!</p>
                </div>
            )}
        </div>
    </section>
);

const CategoryView = () => {
    const { category } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const endpoint = category === 'deals' ? '/api/menu' : `/api/menu/category/${category}`;
                const res = await axios.get(endpoint);
                setItems(res.data);
            } catch (error) {
                console.error('Error fetching category items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [category]);

    if (loading) return <div className="loader-container"><div className="loader" /></div>;

    return <MenuView items={items} title={category.charAt(0).toUpperCase() + category.slice(1)} />;
};

const SearchView = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const query = new URLSearchParams(location.search).get('q')?.toLowerCase();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get('/api/menu');
                const filtered = res.data.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );
                setResults(filtered);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        if (query) fetchResults();
    }, [query]);

    return <MenuView items={results} title={`Search: ${query}`} />;
};

const CartPage = () => {
    const { cart, removeFromCart, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        toast.success('Order placed! Your basket has been cleared.');
        clearCart();
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={20} /> Back</button>
                <h1>Your Basket</h1>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart-premium glass-morphism">
                    <div className="empty-icon-wrap">
                        <ShoppingCart size={48} className="empty-cart-icon" />
                    </div>
                    <h3>No items in the cart</h3>
                    <p>Your basket is currently empty. Explore our menu and add something delicious!</p>
                    <button className="btn-primary classy-btn" onClick={() => navigate('/')}>Back to Menu</button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item glass-morphism">
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <div className="item-meta">
                                        <span>Qty: {item.quantity}</span>
                                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary glass-morphism">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
    return (
        <CartProvider>
            <Router>
                <AppContent />
            </Router>
        </CartProvider>
    );
}
