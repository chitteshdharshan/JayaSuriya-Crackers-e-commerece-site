import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct({ fetchProducts }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    discount: "",
    imageUrl: ""
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFit, setImageFit] = useState("cover");
  const [useUrlOnly, setUseUrlOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "imageUrl") {
      setPreviewUrl(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate prices
    const mrpNum = parseFloat(form.mrp);
    const sellingPriceNum = parseFloat(form.sellingPrice);

    if (mrpNum <= 0 || sellingPriceNum <= 0) {
      alert("❌ MRP and Selling Price must be greater than 0");
      return;
    }

    if (sellingPriceNum > mrpNum) {
      alert("❌ Selling Price cannot be greater than MRP");
      return;
    }

    if (!image && !form.imageUrl) {
      alert("❌ Please upload an image or provide an image URL");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("mrp", form.mrp);
    data.append("sellingPrice", form.sellingPrice);
    if (form.discount) data.append("discount", form.discount);
    if (form.imageUrl) data.append("imageUrl", form.imageUrl);
    if (image && !useUrlOnly) data.append("image", image);

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
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error || "Failed to add product"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: `1px solid var(--border-color)`,
    backgroundColor: "var(--bg-color)",
    color: "var(--text-color)",
    fontSize: "0.9rem",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "0.9rem"
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "700px", 
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
        <p style={{ fontSize: "0.9rem" }}>Admin Panel - Enhanced Product Form</p>
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
          {/* Product Name */}
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <input
              name="category"
              placeholder="Enter category (e.g., Electronics, Crackers)"
              value={form.category}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Product Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={form.description}
              onChange={handleChange}
              style={{...inputStyle, minHeight: "80px", resize: "vertical"}}
            />
          </div>

          {/* Pricing Section */}
          <div style={{
            backgroundColor: "var(--bg-color)",
            padding: "15px",
            borderRadius: "5px",
            border: `1px solid var(--border-color)`
          }}>
            <h3 style={{ marginTop: "0", color: "var(--accent-color)" }}>💰 Pricing</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <label style={labelStyle}>MRP (Original Price) ₹ *</label>
                <input
                  name="mrp"
                  type="number"
                  placeholder="e.g., 999"
                  value={form.mrp}
                  onChange={handleChange}
                  step="0.01"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Selling Price ₹ *</label>
                <input
                  name="sellingPrice"
                  type="number"
                  placeholder="e.g., 699"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  step="0.01"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Discount % (Optional - Auto-calculated if not provided)</label>
              <input
                name="discount"
                type="number"
                placeholder="Leave empty for auto-calculation"
                value={form.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                style={inputStyle}
              />
              {form.mrp && form.sellingPrice && !form.discount && (
                <p style={{ fontSize: "0.8rem", color: "var(--accent-color)", marginTop: "5px" }}>
                  💡 Auto-calculated discount: {Math.round(((parseFloat(form.mrp) - parseFloat(form.sellingPrice)) / parseFloat(form.mrp)) * 100)}%
                </p>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div style={{
            backgroundColor: "var(--bg-color)",
            padding: "15px",
            borderRadius: "5px",
            border: `1px solid var(--border-color)`
          }}>
            <h3 style={{ marginTop: "0", color: "var(--accent-color)" }}>🖼️ Product Image</h3>

            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={useUrlOnly}
                  onChange={(e) => setUseUrlOnly(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <span>Use Image URL only (no file upload)</span>
              </label>
            </div>

            {!useUrlOnly && (
              <div style={{ marginBottom: "10px" }}>
                <label style={labelStyle}>Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setForm({ ...form, imageUrl: "" });
                    if (file) {
                      const blobUrl = URL.createObjectURL(file);
                      setPreviewUrl(blobUrl);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: `1px solid var(--border-color)`,
                    borderRadius: "5px",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    cursor: "pointer"
                  }}
                />
                <p style={{ fontSize: "0.8rem", color: "#888", margin: "5px 0" }}>
                  📁 Selected: {image ? image.name : "No file selected"}
                </p>
              </div>
            )}

            <div>
              <label style={labelStyle}>Image URL</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => {
                  handleChange(e);
                  setImage(null);
                }}
                style={inputStyle}
              />
              <p style={{ fontSize: "0.8rem", color: "#888", margin: "5px 0" }}>
                💡 Provide a direct image URL or upload a file above
              </p>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>Display Mode</label>
              <select
                value={imageFit}
                onChange={(e) => setImageFit(e.target.value)}
                style={inputStyle}
              >
                <option value="cover">Cover (auto crop to fill)</option>
                <option value="contain">Contain (show full image)</option>
                <option value="scale-down">Scale down</option>
              </select>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>Image Preview</label>
              <div style={{
                width: "100%",
                height: "220px",
                borderRadius: "10px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: imageFit
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300?text=No+Preview";
                    }}
                  />
                ) : (
                  <p style={{ color: "#aaa", fontSize: "0.85rem", textAlign: "center", padding: "10px" }}>
                    Preview will appear here when you upload a file or enter a direct image URL.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background: "var(--accent-color)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "bold",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.9"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              ✅ Add Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background: "var(--hover-bg)",
                color: "var(--text-color)",
                border: `1px solid var(--border-color)`,
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;