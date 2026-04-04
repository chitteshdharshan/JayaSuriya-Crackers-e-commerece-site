import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Header({ cartCount }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Jayasuriya Crackers</h1>
          <span className="emoji">🎆</span>
        </div>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            Cart ({cartCount})
          </Link>
        </nav>
      </div>

      <div style={{
        width: "100%",
        backgroundColor: "var(--card-bg)",
        padding: "15px 20px",
        borderTop: `1px solid var(--border-color)`,
        display: "flex",
        justifyContent: "center"
      }}>
        <input
          type="text"
          placeholder="🔍 Search by product name, category, or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // Dispatch event to notify Home component
            window.dispatchEvent(new CustomEvent('searchChange', { detail: e.target.value }));
          }}
          style={{
            padding: "12px 20px",
            width: "90%",
            maxWidth: "600px",
            borderRadius: "25px",
            border: `2px solid var(--accent-color)`,
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            fontSize: "16px",
            transition: "all 0.3s ease",
            boxShadow: searchTerm ? "0 0 15px rgba(102, 126, 234, 0.3)" : "none"
          }}
        />
      </div>
    </header>
  );
}

export default Header;