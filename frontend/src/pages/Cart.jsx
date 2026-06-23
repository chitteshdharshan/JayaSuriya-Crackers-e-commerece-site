import { useState } from "react";

function Cart({ cart, removeFromCart, updateQuantity, clearCart }) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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

  const generateWhatsAppLink = (order) => {
    const adminNumber = "917373073989"; // Admin WhatsApp number
    let text = `*New Order from ${order.name}* 🎆\n\n`;
    text += `*Mobile:* ${order.mobile}\n`;
    text += `*Address:* ${order.address}\n\n`;
    text += `*Order Items:*\n`;
    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ${item.category} (x${item.quantity}) = ₹${((item.sellingPrice || item.price) * item.quantity).toLocaleString()}\n`;
    });
    text += `\n*Total Payable:* ₹${order.total.toLocaleString()}\n`;
    text += `*Total Savings:* ₹${order.savings.toLocaleString()}\n\n`;
    text += `Please confirm my order.`;
    
    return `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
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
      const response = await fetch("https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/place-order", {
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
        const orderData = {
          items: [...cart],
          total: total,
          savings: totalSavings,
          name: customerName,
          mobile: mobileNumber,
          address: address.trim()
        };
        setPlacedOrder(orderData);
        setOrderSuccess(true);
        triggerCelebration();
        clearCart();
        setCustomerName("");
        setMobileNumber("");
        setAddress("");
        setEmail("");

        // Automatically send the order details to WhatsApp
        const whatsappLink = generateWhatsAppLink(orderData);
        window.location.href = whatsappLink;
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

      {orderSuccess && placedOrder ? (
        <div className="animate-fade-in" style={{ padding: '40px 20px', backgroundColor: 'rgba(76, 175, 80, 0.05)', borderRadius: '20px', border: '1px solid #4CAF50' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '4rem' }}>🎉</span>
            <h2 style={{ marginTop: '10px', color: '#4CAF50' }}>Order Placed Successfully!</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Happy Diwali! 🎆</p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginTop: 0 }}>Order Details</h3>
            <div style={{ marginBottom: '20px', fontSize: '0.95rem', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Name:</strong> {placedOrder.name}</div>
              <div><strong>Mobile:</strong> {placedOrder.mobile}</div>
              <div><strong>Address:</strong> {placedOrder.address}</div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', opacity: 0.8 }}>Items Ordered:</h4>
              {placedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{((item.sellingPrice || item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid var(--border)' }}>
              <span>Total Payable</span>
              <span>₹{placedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Please send your order details to our WhatsApp to confirm delivery.</p>
            <a 
              href={generateWhatsAppLink(placedOrder)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="premium-button"
              style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 30px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
            >
              <span style={{ fontSize: '1.3rem' }}>📱</span> Send Order to WhatsApp
            </a>
            <button onClick={() => { setOrderSuccess(false); setPlacedOrder(null); }} style={{ background: 'none', border: 'none', color: 'var(--text)', opacity: 0.7, cursor: 'pointer', textDecoration: 'underline', marginTop: '10px', fontSize: '1rem' }}>
              ← Back to Shopping
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
          <span style={{ fontSize: '4rem' }}>🛒</span>
          <h2 style={{ marginTop: '20px' }}>Your cart is empty</h2>
          <p style={{ opacity: 0.6 }}>Add some amazing fireworks to your cart to celebrate!</p>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="staggered-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item, index) => (
              <div key={index} className="product-card cart-item-card">
                <div style={{ position: 'relative' }}>
                  <img src={item.image || item.imageUrl || "https://via.placeholder.com/80"} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                  {item.discount > 0 && (
                     <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--accent-secondary)', color: 'white', padding: '4px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>-{item.discount}%</div>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                  <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{item.category} (x{item.quantity})</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{(item.sellingPrice || item.price).toLocaleString()}</span>
                    {item.mrp && <span style={{ textDecoration: 'line-through', opacity: 0.4, fontSize: '0.9rem' }}>₹{item.mrp.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="cart-item-controls">
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