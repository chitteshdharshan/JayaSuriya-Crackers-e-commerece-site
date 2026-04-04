function Cart({ cart, removeFromCart }) {
  // Calculate total based on selling price, fallback to price for backward compatibility
  const total = cart.reduce((sum, item) => {
    const price = item.sellingPrice || item.price || 0;
    return sum + price;
  }, 0);

  const originalTotal = cart.reduce((sum, item) => {
    const mrp = item.mrp || 0;
    return sum + mrp;
  }, 0);

  const totalSavings = originalTotal - total;

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1000px", 
      margin: "0 auto", 
      backgroundColor: "var(--bg-color)", 
      color: "var(--text-color)", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>No items in cart</p>
      ) : (
        <>
          <div style={{
            display: "grid",
            gap: "15px",
            marginBottom: "20px",
            gridTemplateColumns: "1fr"
          }}>
            {cart.map((item, index) => {
              const price = item.sellingPrice || item.price;
              const mrp = item.mrp;
              const discount = item.discount || 0;

              return (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid var(--border-color)`,
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--card-bg)",
                  gap: "12px",
                  flexWrap: "wrap",
                  position: "relative"
                }}>
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "#ff4444",
                      color: "white",
                      padding: "3px 8px",
                      borderRadius: "3px",
                      fontSize: "0.7rem",
                      fontWeight: "bold"
                    }}>
                      {discount}% OFF
                    </div>
                  )}

                  {/* Product Image */}
                  {(item.image || item.imageUrl) && (
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      style={{ 
                        width: "60px", 
                        height: "60px", 
                        objectFit: "cover", 
                        borderRadius: "4px",
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60?text=No+Image";
                      }}
                    />
                  )}

                  {/* Product Info */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>{item.name}</h3>
                    <p style={{ margin: "0", fontSize: "0.8rem", color: "#888" }}>
                      {item.category}
                    </p>
                    {/* Pricing */}
                    <div style={{ display: "flex", gap: "8px", margin: "5px 0", alignItems: "center" }}>
                      {mrp && (
                        <p style={{ 
                          margin: "0", 
                          fontSize: "0.85rem", 
                          color: "#888", 
                          textDecoration: "line-through" 
                        }}>
                          ₹{mrp.toLocaleString()}
                        </p>
                      )}
                      <p style={{ 
                        margin: "0", 
                        fontSize: "1rem", 
                        color: "var(--accent-color)", 
                        fontWeight: "bold" 
                      }}>
                        ₹{price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      flexShrink: 0,
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#cc0000"}
                    onMouseLeave={(e) => e.target.style.background = "#ff4444"}
                  >
                    🗑️ Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Price Summary */}
          <div style={{
            backgroundColor: "var(--card-bg)",
            borderRadius: "8px",
            padding: "20px",
            border: `1px solid var(--border-color)`
          }}>
            <h2 style={{ marginTop: "0", marginBottom: "15px" }}>Price Summary</h2>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: `1px solid var(--border-color)`
            }}>
              <span>Subtotal ({cart.length} items):</span>
              <span style={{ fontSize: "1.1rem" }}>₹{total.toLocaleString()}</span>
            </div>

            {originalTotal > total && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                paddingBottom: "10px",
                borderBottom: `1px solid var(--border-color)`,
                color: "#4CAF50"
              }}>
                <span>💚 You Save:</span>
                <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  -₹{totalSavings.toLocaleString()}
                </span>
              </div>
            )}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "var(--accent-color)"
            }}>
              <span>Total Amount:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              💳 Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;