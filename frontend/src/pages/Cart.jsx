import { useState } from "react";

function Cart({ cart, removeFromCart, updateQuantity, clearCart }) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = cart.reduce((sum, item) => (sum + (item.sellingPrice || item.price || 0) * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => (sum + (item.mrp || 0) * item.quantity), 0);
  const totalSavings = originalTotal - total;

  const triggerCelebration = () => {
    // Trigger multiple random fireworks
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-firework', { 
          detail: { 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight 
          } 
        }));
      }, i * 150);
    }
  };

  const handleCheckout = async () => {
    if (!customerName || !mobileNumber || !address.trim() || !email.trim()) {
      alert("Please enter your name, mobile number, email, and delivery address.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (mobileNumber.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await fetch("http://localhost:5001/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          mobile: mobileNumber,
          email: email.trim(),
          address: address.trim(),
          cartItems: cart,
          totalAmount: total,
        }),
      });

      if (response.ok) {
        setOrderSuccess(true);
        triggerCelebration();
        clearCart();
        setCustomerName("");
        setMobileNumber("");
        setAddress("");
        setEmail("");
      } else {
        const data = await response.json();
        alert("❌ Error: " + (data.error || "Failed to place order"));
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Something went wrong while placing the order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="animate-fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
        🛒 Your Cart
      </h1>

      {orderSuccess ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '20px', border: '2px dashed #4CAF50' }}>
          <span style={{ fontSize: '5rem' }}>🎉</span>
          <h2 style={{ marginTop: '20px', color: '#4CAF50' }}>Order Placed Successfully!</h2>
          <p style={{ opacity: 0.9, fontSize: '1.2rem', margin: '20px 0' }}>Happy Diwali! 🎆<br/>Our dealer will call you soon to confirm your delivery details.</p>
          <button onClick={() => setOrderSuccess(false)} className="premium-button" style={{ marginTop: '20px' }}>
            ← Continue Shopping
          </button>
        </div>
      ) : cart.length === 0 ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
          <span style={{ fontSize: '4rem' }}>🛒</span>
          <h2 style={{ marginTop: '20px' }}>Your cart is empty</h2>
          <p style={{ opacity: 0.6 }}>Add some amazing fireworks to your cart to celebrate!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div className="staggered-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item, index) => (
              <div key={index} className="product-card" style={{ display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '15px', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={item.image || item.imageUrl || "https://via.placeholder.com/80"} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                  {item.discount > 0 && (
                     <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--accent-secondary)', color: 'white', padding: '4px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>-{item.discount}%</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                  <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{item.category} (x{item.quantity})</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{(item.sellingPrice || item.price).toLocaleString()}</span>
                    {item.mrp && <span style={{ textDecoration: 'line-through', opacity: 0.4, fontSize: '0.9rem' }}>₹{item.mrp.toLocaleString()}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => updateQuantity(item._id, -1)} 
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer' }}
                  >−</button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, 1)} 
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer' }}
                  >+</button>
                </div>

                <button onClick={() => removeFromCart(item._id)} style={{ backgroundColor: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.2)', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor='#ff4444'; e.target.style.color='#fff'; }} onMouseLeave={(e) => { e.target.style.backgroundColor='rgba(255,68,68,0.1)'; e.target.style.color='#ff4444'; }}>🗑️</button>
              </div>
            ))}
          </div>

          {/* Checkout & Summary */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Customer Details */}
            <div className="product-card" style={{ padding: '25px', borderRadius: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📋 Checkout Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Full Name</label>
                  <input type="text" className="search-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Mobile Number</label>
                  <input type="tel" className="search-input" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Email Address</label>
                  <input type="email" className="search-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Delivery Address</label>
                  <textarea className="search-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full delivery address" style={{ height: '80px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="product-card" style={{ padding: '25px', borderRadius: '20px', border: '2px solid var(--accent) !important' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>💰 Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{originalTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50' }}>
                  <span>Diwali Savings 🧨</span>
                  <span>-₹{totalSavings.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--accent)' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={isPlacingOrder} className="premium-button" style={{ width: '100%', marginTop: '30px', padding: '15px !important', fontSize: '1.2rem' }}>
                {isPlacingOrder ? "⌛ Ordering..." : "🚀 Place Diwali Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;