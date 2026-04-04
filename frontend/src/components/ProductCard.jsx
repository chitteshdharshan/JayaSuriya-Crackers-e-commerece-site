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
      height: "100%",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#ff4444",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "0.75rem",
          fontWeight: "bold",
          zIndex: 10
        }}>
          {product.discount}% OFF
        </div>
      )}

      {/* Product Image */}
      {(product.image || product.imageUrl) && (
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          style={{ 
            width: "100%", 
            height: "200px", 
            objectFit: "cover", 
            borderRadius: "5px",
            marginBottom: "10px",
            display: "block"
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />
      )}

      {/* Product Name */}
      <h3 style={{ margin: "8px 0", fontSize: "1rem", fontWeight: "bold" }}>
        {product.name}
      </h3>

      {/* Product Description */}
      {product.description && (
        <p style={{ 
          margin: "5px 0", 
          fontSize: "0.8rem", 
          color: "#aaa", 
          flex: 1,
          minHeight: "40px"
        }}>
          {product.description.length > 50 
            ? product.description.substring(0, 50) + "..." 
            : product.description}
        </p>
      )}

      {/* Price Section */}
      <div style={{
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap"
      }}>
        {/* MRP with Strikethrough */}
        {product.mrp && (
          <p style={{
            margin: "0",
            fontSize: "0.85rem",
            color: "#888",
            textDecoration: "line-through"
          }}>
            ₹{product.mrp.toLocaleString()}
          </p>
        )}
        
        {/* Selling Price - Highlighted */}
        {product.sellingPrice && (
          <p style={{
            margin: "0",
            fontSize: "1.3rem",
            color: "var(--accent-color)",
            fontWeight: "bold"
          }}>
            ₹{product.sellingPrice.toLocaleString()}
          </p>
        )}
        {/* Fallback for old format */}
        {!product.sellingPrice && product.price && (
          <p style={{
            margin: "0",
            fontSize: "1.3rem",
            color: "var(--accent-color)",
            fontWeight: "bold"
          }}>
            ₹{product.price.toLocaleString()}
          </p>
        )}
      </div>

      {/* Category */}
      <p style={{ 
        color: "#ccc", 
        margin: "5px 0", 
        fontSize: "0.85rem" 
      }}>
        {product.category}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        style={{
          background: "var(--accent-color)",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "auto",
          fontSize: "0.95rem",
          fontWeight: "bold",
          transition: "transform 0.2s",
          transform: "scale(1)"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
