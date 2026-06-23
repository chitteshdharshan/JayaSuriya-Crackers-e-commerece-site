import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AddProduct from "./components/AddProduct";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import CelebrationBackground from "./components/CelebrationBackground";
import FireworkBurst from "./components/FireworkBurst";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bursts, setBursts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    const playFireworkSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Generate a quick static burst buffer
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          // Sharp decay noise
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 5);
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        // Filter to make it deeper "pop" and not harsh static
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
        
        // Volume dropoff
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
      } catch (e) {
        // Silently fail if Audio is blocked before user interaction
      }
    };

    // Listen for global firework bursts
    const handleBurst = (e) => {
      const { x, y } = e.detail;
      const id = Date.now() + Math.random().toString();
      setBursts(prev => [...prev, { id, x, y }]);
      playFireworkSound();
    };

    window.addEventListener('trigger-firework', handleBurst);
    return () => window.removeEventListener('trigger-firework', handleBurst);
  }, []);

  const addToCart = (product, event) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    if (event) {
      window.dispatchEvent(new CustomEvent('trigger-firework', { 
        detail: { x: event.clientX, y: event.clientY } 
      }));
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeBurst = (id) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  return (
    <Router>
      <CelebrationBackground />
      {bursts.map(b => (
        <FireworkBurst key={b.id} x={b.x} y={b.y} onComplete={() => removeBurst(b.id)} />
      ))}
      
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home products={products} cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} />} />
            <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard fetchProducts={fetchProducts} /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route path="/add-product" element={isAdmin ? <AddProduct fetchProducts={fetchProducts} /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;