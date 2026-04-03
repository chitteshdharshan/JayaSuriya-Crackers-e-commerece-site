import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct({ fetchProducts }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("image", image);

    try {
      const res = await fetch("http://localhost:5001/api/add-product", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("✅ Product Added Successfully");
        fetchProducts();
        navigate("/");
      } else {
        alert("❌ Error adding product");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "0 auto", 
      backgroundColor: "var(--bg-color)", 
      color: "var(--text-color)", 
      minHeight: "100vh" 
    }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ 
          color: "var(--accent-color)",
          fontSize: "1.5rem",
          margin: "10px 0"
        }}>
          🛠️ Add Product
        </h1>
        <p style={{ fontSize: "0.9rem" }}>Admin Panel</p>
      </div>

      <div style={{
        backgroundColor: "var(--card-bg)",
        padding: "20px",
        borderRadius: "10px",
        border: `1px solid var(--border-color)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Product Name
            </label>
            <input
              name="name"
              placeholder="Enter product name"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              placeholder="Enter price"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Category
            </label>
            <input
              name="category"
              placeholder="Enter category"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Product Image
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: `1px solid var(--border-color)`,
                borderRadius: "5px",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.85rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "11px",
                background: "var(--accent-color)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "bold"
              }}
            >
              ✅ Add Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "11px",
                background: "var(--hover-bg)",
                color: "var(--text-color)",
                border: `1px solid var(--border-color)`,
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;