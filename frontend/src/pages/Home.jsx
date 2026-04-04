import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function Home({ products, addToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Listen to search changes from Header
  useEffect(() => {
    const handleSearchChange = (event) => {
      setSearchTerm(event.detail);
      setCurrentPage(1);
    };

    window.addEventListener('searchChange', handleSearchChange);
    return () => window.removeEventListener('searchChange', handleSearchChange);
  }, []);

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower)) ||
      (p.category && p.category.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1400px", 
      margin: "0 auto", 
      backgroundColor: "var(--bg-color)", 
      color: "var(--text-color)", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        fontSize: "2rem"
      }}>
        Welcome to Jayasuriya Crackers 🎆
      </h1>

      {searchTerm && (
        <div style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "14px",
          color: "var(--text-color)",
          opacity: "0.8"
        }}>
          {filteredProducts.length === 0 ? (
            <span style={{ color: "#ff6b6b" }}>
              ❌ No products found matching "{searchTerm}"
            </span>
          ) : null}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "30px"
          }}>
            {paginatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ 
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "10px 20px",
                  backgroundColor: currentPage === 1 ? "#999" : "var(--accent-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.3s"
                }}
              >
                ← Previous
              </button>
              <span style={{ color: "var(--text-color)", fontSize: "14px", minWidth: "120px" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "10px 20px",
                  backgroundColor: currentPage === totalPages ? "#999" : "var(--accent-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.3s"
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--text-color)",
          opacity: "0.6"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>🎯 No Products Available</p>
          {searchTerm && (
            <p style={{ fontSize: "14px" }}>
              Try adjusting your search terms or browse all products by clearing the search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;