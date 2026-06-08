import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ fetchProducts }) {
  const [products, setProducts] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch("https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleImageUpdate = async (id, file) => {
    if (!file) return;

    setUploadingId(id);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/products/${id}/image`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        fetchAllProducts();
        fetchProducts(); 
      } else {
        const data = await res.json();
        alert("❌ Error updating image: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/products/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("✅ Product deleted successfully");
          fetchAllProducts();
          fetchProducts(); 
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
    <div style={{ padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ marginBottom: "10px" }}>🛠️ Admin Dashboard</h1>
        <p style={{ opacity: 0.7 }}>Manage your festive firework inventory</p>
      </div>

      <div className="animate-fade-in" style={{ 
        display: "flex", 
        gap: "20px", 
        justifyContent: "center", 
        marginBottom: "50px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => navigate("/add-product")}
          className="premium-button"
        >
          ➕ Add New Product
        </button>
        <button
          onClick={() => navigate("/")}
          className="nav-link"
          style={{ 
            padding: "12px 25px", 
            border: '1px solid var(--border)', 
            borderRadius: '30px',
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}
        >
          ← Back to Store
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px", opacity: 0.5 }}>
           <p style={{ fontSize: "1.5rem" }}>No products added yet</p>
        </div>
      ) : (
        <div className="product-grid staggered-list">
          {products.map((product) => (
            <div key={product._id} className="product-card" style={{
              padding: "20px",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              {(product.image || product.imageUrl) && (
                <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                </div>
              )}
              <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>{product.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
                  ₹{(product.sellingPrice || product.price || 0).toLocaleString()}
                </span>
                {product.mrp && (
                   <span style={{ fontSize: "0.8rem", opacity: 0.5, textDecoration: "line-through" }}>
                     ₹{product.mrp.toLocaleString()}
                   </span>
                )}
              </div>
              <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>{product.category}</p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <label style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255, 215, 0, 0.1)",
                  color: "var(--accent)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 0
                }}
                onMouseEnter={(e) => { e.target.style.background='var(--accent)'; e.target.style.color='#000'; }}
                onMouseLeave={(e) => { e.target.style.background='rgba(255, 215, 0, 0.1)'; e.target.style.color='var(--accent)'; }}
                >
                  {uploadingId === product._id ? "⌛..." : "📷 Update"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }}
                    onClick={(e) => { e.target.value = null; }}
                    onChange={(e) => handleImageUpdate(product._id, e.target.files[0])}
                    disabled={uploadingId === product._id}
                  />
                </label>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255, 68, 68, 0.1)",
                    color: "#ff4444",
                    border: "1px solid rgba(255, 68, 68, 0.2)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { e.target.style.background='#ff4444'; e.target.style.color='#fff'; }}
                  onMouseLeave={(e) => { e.target.style.background='rgba(255, 68, 68, 0.1)'; e.target.style.color='#ff4444'; }}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
