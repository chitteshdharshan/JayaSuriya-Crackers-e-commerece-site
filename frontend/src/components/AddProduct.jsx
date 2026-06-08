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
      const res = await fetch("https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/add-product", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("✅ Product Added Successfully");
        fetchProducts();
        navigate("/admin/dashboard");
      } else {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error || "Failed to add product"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ marginBottom: "10px" }}>🛡️ Inventory Manager</h1>
        <p style={{ opacity: 0.7 }}>Add new festive products to your collection</p>
      </div>

      <div className="product-card animate-fade-in" style={{ padding: "40px", borderRadius: "20px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Product Name *</label>
              <input name="name" className="search-input" value={form.name} onChange={handleChange} required placeholder="e.g. 1000 Wala Crackers" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Category *</label>
              <input name="category" className="search-input" value={form.category} onChange={handleChange} required placeholder="e.g. Gift Box" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Product Description</label>
            <textarea name="description" className="search-input" value={form.description} onChange={handleChange} style={{ minHeight: "100px", borderRadius: "15px" }} placeholder="Describe the festive magic..." />
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>💰 Price & Discount</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>MRP ₹ *</label>
                <input name="mrp" type="number" className="search-input" value={form.mrp} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Selling Price ₹ *</label>
                <input name="sellingPrice" type="number" className="search-input" value={form.sellingPrice} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>🖼️ Media</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Upload Image</label>
                <input type="file" accept="image/*" className="search-input" onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) setPreviewUrl(URL.createObjectURL(file));
                }} />
              </div>
              <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>- OR -</div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Image URL</label>
                <input name="imageUrl" className="search-input" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '20px', borderRadius: '15px', overflow: 'hidden', height: '200px', border: '1px solid var(--border)' }}>
                <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Preview" />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
             <button type="submit" className="premium-button" style={{ flex: 1 }}>
               ✨ Add to Inventory
             </button>
             <button type="button" onClick={() => navigate("/admin/dashboard")} className="nav-link" style={{ flex: 1, padding: "12px", border: '1px solid var(--border)', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
               ← Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;