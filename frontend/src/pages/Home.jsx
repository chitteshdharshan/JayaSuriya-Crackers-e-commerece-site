import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function Home({ products, cart, addToCart, updateQuantity }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 8;

  const categories = ["All", ...new Set(Array.isArray(products) ? products.map(p => p.category) : [])];

  // Listen to search changes from Header
  useEffect(() => {
    // 🎉 Trigger welcome fireworks on Home page load
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-firework', {
          detail: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * (window.innerHeight * 0.7) // upper 70% of screen
          }
        }));
      }, i * 250);
    }

    const handleSearchChange = (event) => {
      setSearchTerm(event.detail);
      setCurrentPage(1);
    };

    window.addEventListener('searchChange', handleSearchChange);
    return () => window.removeEventListener('searchChange', handleSearchChange);
  }, []);

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower)) ||
      (p.category && p.category.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <div style={{
      padding: "40px 20px",
      maxWidth: "1400px",
      margin: "0 auto",
    }}>
      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ marginBottom: '10px' }}>
          Jayasuriya Crackers
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: '0.8', maxWidth: '600px', margin: '0 auto' }}>
          Celebrate this Diwali with our premium range of fireworks. Safe, vibrant, and delivered to your doorstep.
        </p>
      </header>

      <div className="home-layout">
        <aside className="sidebar animate-fade-in">
          <h3>Categories</h3>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="main-content">
          {searchTerm && filteredProducts.length === 0 ? (
            <div className="animate-fade-in" style={{
              textAlign: "center",
              padding: "100px 20px",
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: '20px',
              border: '1px dashed var(--border)'
            }}>
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h2 style={{ marginTop: '20px' }}>No products found</h2>
              <p style={{ opacity: '0.6' }}>We couldn't find anything matching "{searchTerm}"</p>
            </div>
          ) : (
            <>
              <div className="product-grid staggered-list">
                {paginatedProducts.map((p) => {
                  const cartItem = cart.find(item => item._id === p._id);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                    <ProductCard
                      key={p._id}
                      product={p}
                      addToCart={addToCart}
                      quantity={quantity}
                      updateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="animate-fade-in" style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px"
                }}>
                  <button
                    className="premium-button"
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontWeight: '600', fontSize: '1.1rem', minWidth: '150px', textAlign: 'center' }}>
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className="premium-button"
                    onClick={() => {
                      setCurrentPage(Math.min(totalPages, currentPage + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>

      {/* ✅ SEO Section — helps Google rank for "Sivakasi crackers" */}
      <section style={{
        maxWidth: '1100px',
        margin: '60px auto 0',
        padding: '40px 30px',
        background: 'rgba(255,215,0,0.04)',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '20px',
        color: '#aaa',
        lineHeight: '1.9',
        fontSize: '0.92rem'
      }}>
        <h2 style={{ color: '#ffd700', marginBottom: '16px', fontSize: '1.3rem' }}>
          Buy Sivakasi Crackers Online — Jayasuriya Crackers
        </h2>
        <p>
          Welcome to <strong style={{ color: '#fff' }}>Jayasuriya Crackers</strong> — your trusted destination to
          <strong style={{ color: '#ffd700' }}> buy Sivakasi crackers online</strong> at unbeatable factory-direct prices.
          Located in the heart of <strong style={{ color: '#fff' }}>Sivakasi, Tamil Nadu</strong> — the fireworks capital of India —
          we bring you the finest quality Diwali crackers, sparklers, flower pots, aerial shots, and ground chakkars
          delivered safely to your doorstep.
        </p>
        <h3 style={{ color: '#ffd700', margin: '20px 0 10px', fontSize: '1rem' }}>
          Why Choose Our Sivakasi Crackers?
        </h3>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>🏭 Direct from Sivakasi factories — lowest prices guaranteed</li>
          <li>🔒 100% safety-certified crackers approved by Tamil Nadu authorities</li>
          <li>🚀 Fast home delivery across Tamil Nadu and all over India</li>
          <li>🎁 Diwali gift packs, bulk orders & wholesale crackers available</li>
          <li>📞 Personal support on WhatsApp: <strong style={{ color: '#fff' }}>+91 9442275989</strong></li>
        </ul>
        <p style={{ marginTop: '16px' }}>
          Whether you're searching for <em>Sivakasi crackers near me</em>, <em>online crackers shop Tamil Nadu</em>,
          or the <em>best Diwali fireworks deals</em> — Jayasuriya Crackers is your one-stop shop.
          We've been serving happy customers for over <strong style={{ color: '#ffd700' }}>10 years</strong> and counting. 🎆
        </p>
      </section>
    </>
  );
}

export default Home;