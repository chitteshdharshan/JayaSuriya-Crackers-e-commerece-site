function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
            {cart.map((item, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid var(--border-color)`,
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "var(--card-bg)",
                gap: "12px",
                flexWrap: "wrap"
              }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      objectFit: "cover", 
                      borderRadius: "3px",
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=No+Image";
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <h3 style={{ margin: "0 0 5px 0" }}>{item.name}</h3>
                  <p style={{ margin: "0", fontSize: "0.9rem" }}>₹{item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    flexShrink: 0
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: "center",
            fontSize: "1.3rem",
            fontWeight: "bold",
            padding: "20px",
            backgroundColor: "var(--card-bg)",
            borderRadius: "8px"
          }}>
            Total: ₹{total}
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;