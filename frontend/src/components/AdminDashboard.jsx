import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ fetchProducts }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const res = await fetch("http://localhost:5001/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("✅ Product deleted successfully");
          fetchAllProducts();
          fetchProducts(); // Refresh main products list
        } else {
          alert("❌ Error deleting product");
        }
      } catch (err) {
        console.error(err);
        alert("Server Error");
      }
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1400px", 
      margin: "0 auto", 
      backgroundColor: "var(--bg-color)", 
      color: "var(--text-color)", 
      minHeight: "100vh" 
    }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--accent-color)", fontSize: "2rem", margin: "10px 0" }}>
          🛠️ Admin Dashboard
        </h1>
        <p style={{ margin: "5px 0" }}>Manage your products</p>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "10px", 
        justifyContent: "center", 
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => navigate("/add-product")}
          style={{
            padding: "11px 20px",
            background: "var(--accent-color)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          ➕ Add New Product
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "11px 20px",
            background: "var(--hover-bg)",
            color: "var(--text-color)",
            border: `1px solid var(--border-color)`,
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ← Back to Store
        </button>
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>No products added yet</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          {products.map((product) => (
            <div key={product._id} style={{
              backgroundColor: "var(--card-bg)",
              border: `1px solid var(--border-color)`,
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=No+Image";
                  }}
                />
              )}
              <h3 style={{ margin: "10px 0", fontSize: "1rem" }}>{product.name}</h3>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "var(--accent-color)", 
                fontWeight: "bold",
                margin: "5px 0"
              }}>
                ₹{product.price}
              </p>
              <p style={{ 
                color: "#ccc", 
                marginBottom: "12px",
                fontSize: "0.9rem",
                margin: "5px 0"
              }}>
                Category: {product.category}
              </p>
              <button
                onClick={() => handleDelete(product._id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold"
                }}
              >
                🗑️ Remove Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
