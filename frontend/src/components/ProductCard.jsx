function ProductCard({ product, addToCart }) {
  return (
    <div style={{
      border: `1px solid var(--border-color)`,
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      backgroundColor: "var(--card-bg)",
      color: "var(--text-color)",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ 
            width: "100%", 
            height: "120px", 
            objectFit: "cover", 
            borderRadius: "5px",
            marginBottom: "10px"
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      )}
      <h3 style={{ margin: "5px 0", fontSize: "1rem" }}>{product.name}</h3>
      <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "var(--accent-color)", fontWeight: "bold" }}>
        ₹{product.price}
      </p>
      <p style={{ color: "#ccc", margin: "5px 0", fontSize: "0.85rem", flex: 1 }}>
        {product.category}
      </p>
      <button
        onClick={() => addToCart(product)}
        style={{
          background: "var(--accent-color)",
          color: "white",
          border: "none",
          padding: "8px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          fontSize: "0.9rem",
          fontWeight: "bold"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
