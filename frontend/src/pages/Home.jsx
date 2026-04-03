import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function Home({ products, addToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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

      <div style={{ 
        textAlign: "center", 
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center"
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px 20px",
            width: "90%",
            maxWidth: "400px",
            borderRadius: "25px",
            border: `1px solid var(--border-color)`,
            backgroundColor: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "16px"
          }}
        />
      </div>

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
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Previous
          </button>
          <span style={{ color: "var(--text-color)", fontSize: "14px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;