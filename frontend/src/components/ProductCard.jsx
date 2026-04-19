function ProductCard({ product, addToCart, quantity = 0, updateQuantity }) {
  return (
    <div className="product-card" style={{
      padding: "15px",
      borderRadius: "15px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
    }}>
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          backgroundColor: "var(--accent-secondary)",
          color: "white",
          padding: "5px 12px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "bold",
          zIndex: 10,
          boxShadow: "0 0 10px rgba(255, 102, 0, 0.5)"
        }}>
          {product.discount}% OFF
        </div>
      )}

      {/* Product Image */}
      {(product.image || product.imageUrl) && (
        <div style={{ overflow: 'hidden', borderRadius: '10px', marginBottom: '15px' }}>
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            style={{ 
              width: "100%", 
              height: "220px", 
              objectFit: "cover", 
              display: "block"
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        </div>
      )}

      {/* Product Information */}
      <h3 style={{ margin: "10px 0", fontSize: "1.2rem", fontWeight: "700" }}>
        {product.name}
      </h3>

      {product.description && (
        <p style={{ 
          margin: "8px 0", 
          fontSize: "0.85rem", 
          opacity: "0.7", 
          flex: 1,
          minHeight: "45px"
        }}>
          {product.description.length > 60 
            ? product.description.substring(0, 60) + "..." 
            : product.description}
        </p>
      )}

      {/* Price Section */}
      <div style={{
        margin: "15px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px"
      }}>
        {product.mrp && (
          <p style={{
            margin: "0",
            fontSize: "0.9rem",
            opacity: "0.5",
            textDecoration: "line-through"
          }}>
            ₹{product.mrp.toLocaleString()}
          </p>
        )}
        
        <p style={{
          margin: "0",
          fontSize: "1.4rem",
          color: "var(--accent)",
          fontWeight: "800"
        }}>
          ₹{(product.sellingPrice || product.price || 0).toLocaleString()}
        </p>
      </div>

      {quantity > 0 ? (
        <div style={{ 
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "12px",
          padding: "5px",
          border: "1px solid var(--border)",
          height: "45px"
        }}>
          <button 
            onClick={() => updateQuantity(product._id, -1)}
            style={{
              background: "rgba(255, 68, 68, 0.1)",
              color: "#ff4444",
              border: "none",
              borderRadius: "8px",
              width: "35px",
              height: "35px",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              fontWeight: "bold"
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(255, 68, 68, 0.2)"; }}
            onMouseLeave={(e) => { e.target.style.background = "rgba(255, 68, 68, 0.1)"; }}
          >
            −
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Qty</span>
            <span style={{ fontWeight: "800", fontSize: "1.1rem", color: "var(--accent)" }}>{quantity}</span>
          </div>

          <button 
            onClick={(e) => addToCart(product, e)}
            style={{
              background: "rgba(76, 175, 80, 0.1)",
              color: "#4CAF50",
              border: "none",
              borderRadius: "8px",
              width: "35px",
              height: "35px",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              fontWeight: "bold"
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(76, 175, 80, 0.2)"; }}
            onMouseLeave={(e) => { e.target.style.background = "rgba(76, 175, 80, 0.1)"; }}
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => addToCart(product, e)}
          className="premium-button"
          style={{ marginTop: "auto" }}
        >
          <span>🛒 Add to Cart</span>
        </button>
      )}
    </div>
  );
}

export default ProductCard;
