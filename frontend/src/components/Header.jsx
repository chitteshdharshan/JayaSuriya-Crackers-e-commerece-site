import { Link } from "react-router-dom";
import "../App.css"; // Assuming we add styles here

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Jayasuriya Crackers</h1>
          <span className="emoji">🎆</span>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for crackers..."
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;