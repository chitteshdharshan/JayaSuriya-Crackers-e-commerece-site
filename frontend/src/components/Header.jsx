import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import logo from "../assets/images.jpg";

function Header({ cartCount }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    window.dispatchEvent(new CustomEvent('searchChange', { detail: val }));
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">
            <img 
              src={logo} 
              alt="Jayasuriya Crackers Logo" 
              style={{ 
                height: '55px', 
                width: 'auto', 
                objectFit: 'contain',
                borderRadius: '8px'
              }} 
            />
          </div>
        </Link>

        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search fireworks..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <nav className="nav" style={{ display: 'flex', gap: '15px', alignItems: 'center', minWidth: 'fit-content' }}>
          <Link to="/" className="nav-link" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
          <Link to="/cart" className="nav-link cart-link" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            padding: '10px 18px',
            borderRadius: '25px',
            border: '1px solid var(--border)',
            transition: 'all 0.3s'
          }}>
            <span className="cart-icon">🛒</span>
            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>({cartCount})</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;