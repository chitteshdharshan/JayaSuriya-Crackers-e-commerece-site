import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AddProduct from "./components/AddProduct";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5001/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  return (
    <Router>
      <Header cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard fetchProducts={fetchProducts} /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/add-product" element={isAdmin ? <AddProduct fetchProducts={fetchProducts} /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;