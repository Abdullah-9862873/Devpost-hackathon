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

    const { addToCart, clearCart } = useCart();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

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
        setIsLoading(true);

        try {
            const response = await axios.post('/api/ai/process-command', { transcript });
            const { action, payload } = response.data;

            if (action === 'GET_CATEGORY') {
                const categoryExists = allMenuItems.some(item => item.category === payload.category);
                if (categoryExists) {
                    navigate(`/category/${payload.category}`);
                } else {
                    navigate(`/search?q=${payload.category}`);
                }
            }

            if (action === 'GET_OFFERS') {
                navigate('/offers');
            }

            if (action === 'SEARCH') {
                navigate(`/search?q=${payload.query}`);
            }

            if (action === 'NAVIGATE') {
                const page = payload.page.toLowerCase();
                if (page === 'home' || page === 'menu') navigate('/');
                else navigate(`/${page}`);
            }

            if (action === 'ADD_TO_CART') {
                const itemName = (payload.name || "").toLowerCase();
                const item = allMenuItems.find(i =>
                    i.name.toLowerCase().includes(itemName) ||
                    itemName.includes(i.name.toLowerCase())
                );

                if (item) {
                    addToCart(item);
                } else {
                    toast.error(`I couldn't find "${payload.name || 'that item'}" on the menu.`);
                }
            }

            if (action === 'PROCESS_PAYMENT') {
                setIsProcessingOrder(true);
                toast.loading('Processing your order...', { id: 'payment' });

                // Simulate payment delay
                setTimeout(() => {
                    clearCart();
                    setIsProcessingOrder(false);
                    toast.success('Payment Successful! Your order is being prepared.', { id: 'payment', duration: 5000 });
                    navigate('/');
                }, 2000);
            }

            if (action === 'LIST_CATEGORIES') {
                const categoryList = (payload.categories || []).join(', ');
                if (categoryList) {
                    toast(
                        `We have: ${categoryList}. ${payload.hasOffers ? "We also have great deals today!" : ""}\nWhat would you like to have?`,
                        { icon: '🍴', duration: 6000 }
                    );
                } else {
                    toast.error("I couldn't fetch the categories. Try asking again?");
                }
            }

            if (action === 'GUIDE_USER') {
                toast(payload.message || "I can help you browse the menu and place an order!", { icon: '💡', duration: 8000 });
            }

        } catch (error) {
            console.error("Voice AI failed", error);
            if (error.response?.status === 429) {
                toast.error("API Rate limit exceeded. Please wait a moment and try again.");
            } else {
                const errorMsg = error.response?.data?.details || "I hit a snag understanding that. Try again?";
                toast.error(errorMsg);
            }
        } finally {
            setIsLoading(false);
            setNotification(null);
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
                    <Route path="/offers" element={<OffersView />} />
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
                const filtered = res.data.filter(item => {
                    const searchTerms = query.split(' '); // Split "something to drink" into ["something", "to", "drink"]
                    const itemText = `${item.name} ${item.description} ${item.category}`.toLowerCase();

                    // Returns true if ANY of the search words are found in the item details
                    return searchTerms.some(term => term.length > 2 && itemText.includes(term));
                });
                setResults(filtered);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        if (query) fetchResults();
    }, [query]);

    return <MenuView items={results} title={`Search: ${query}`} />;
};

const OffersView = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get('/api/menu');
                // Filter items that have a discount field and its > 0
                const discounted = res.data.filter(item => item.discount && item.discount > 0);
                setOffers(discounted);
            } catch (error) {
                console.error('Error fetching offers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    if (loading) return <div className="loader-container"><div className="loader" /></div>;

    return <MenuView items={offers} title="Flash Deals & Offers" />;
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
