import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function Cart({ cart, removeFromCart, updateQuantity, clearCart }) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.canShare) {
      try {
        const file = new File([""], "ping.txt", { type: "text/plain" });
        if (navigator.canShare({ files: [file] })) {
          setCanShare(true);
        }
      } catch (e) {
        // not supported
      }
    }
  }, []);

  const total = cart.reduce((sum, item) => (sum + (item.sellingPrice || item.price || 0) * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => (sum + (item.mrp || 0) * item.quantity), 0);
  const totalSavings = originalTotal - total;

  const triggerCelebration = () => {
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

  const generateWhatsAppLink = (order, pdfUrl) => {
    const adminNumber = "917373073989";
    let text = `*New Order from ${order.name}*\n\n`;
    text += `*Mobile:* ${order.mobile}\n`;
    text += `*Address:* ${order.address}\n\n`;
    text += `*Order Items:*\n`;
    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ${item.category} (x${item.quantity}) = Rs.${((item.sellingPrice || item.price) * item.quantity).toLocaleString()}\n`;
    });
    text += `\n*Total Payable:* Rs.${order.total.toLocaleString()}\n`;
    text += `*Diwali Savings:* Rs.${order.savings.toLocaleString()}\n\n`;
    if (pdfUrl) {
      text += `*Invoice PDF:* ${pdfUrl}\n\n`;
    }
    text += `Please confirm my order. Thank you!`;
    return `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
  };

  const generatePDF = (order) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    // ── Header background ──
    doc.setFillColor(15, 52, 96);
    doc.rect(0, 0, pageW, 48, "F");

    // Gold accent strip
    doc.setFillColor(255, 200, 0);
    doc.rect(0, 44, pageW, 4, "F");

    // Company name
    doc.setTextColor(255, 200, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("JAYASURIYA CRACKERS", 15, 20);

    // Tagline
    doc.setTextColor(200, 220, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Premium Fireworks & Crackers", 15, 28);
    doc.text("Phone: +91 73730 73989", 15, 34);

    // Invoice label on right
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ORDER INVOICE", pageW - 15, 20, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 220, 255);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, pageW - 15, 28, { align: "right" });
    doc.text(`Order ID: JC-${Date.now().toString().slice(-6)}`, pageW - 15, 34, { align: "right" });

    // ── Bill To box ──
    doc.setFillColor(240, 246, 255);
    doc.roundedRect(15, 54, pageW - 30, 38, 3, 3, "F");
    doc.setDrawColor(180, 210, 255);
    doc.setLineWidth(0.4);
    doc.roundedRect(15, 54, pageW - 30, 38, 3, 3, "S");

    doc.setTextColor(15, 52, 96);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("BILLED TO", 20, 62);
    doc.setDrawColor(255, 200, 0);
    doc.setLineWidth(1);
    doc.line(20, 64, 48, 64);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(order.name, 20, 71);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Mobile: ${order.mobile}`, 20, 78);

    // Wrap long address
    const addrLines = doc.splitTextToSize(`Address: ${order.address}`, pageW - 40);
    doc.text(addrLines, 20, 84);

    // ── Items Table ──
    const tableHead = [["#", "Item", "Category", "Qty", "Rate (Rs)", "Amount (Rs)"]];
    const tableBody = order.items.map((item, i) => [
      i + 1,
      item.name,
      item.category || "-",
      item.quantity,
      Number(item.sellingPrice || item.price).toLocaleString("en-IN"),
      Number((item.sellingPrice || item.price) * item.quantity).toLocaleString("en-IN"),
    ]);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 98,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, textColor: [30, 30, 30] },
      headStyles: {
        fillColor: [15, 52, 96],
        textColor: [255, 200, 0],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        3: { halign: "center", cellWidth: 14 },
        4: { halign: "right", cellWidth: 28 },
        5: { halign: "right", cellWidth: 30 },
      },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      margin: { left: 15, right: 15 },
    });

    const afterTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 160;

    // ── Totals section ──
    const totalsX = pageW - 80;
    const totalsY = afterTableY + 10;

    doc.setFillColor(245, 248, 255);
    doc.roundedRect(totalsX - 5, totalsY - 6, 75, 34, 3, 3, "F");
    doc.setDrawColor(180, 210, 255);
    doc.setLineWidth(0.4);
    doc.roundedRect(totalsX - 5, totalsY - 6, 75, 34, 3, 3, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Subtotal:", totalsX, totalsY);
    const pdfOriginalTotal = order.items.reduce((sum, item) => (sum + (item.mrp || 0) * item.quantity), 0);
    doc.text(`Rs. ${Number(pdfOriginalTotal).toLocaleString("en-IN")}`, pageW - 15, totalsY, { align: "right" });

    doc.setTextColor(34, 139, 34);
    doc.text("Diwali Savings:", totalsX, totalsY + 7);
    doc.text(`- Rs. ${Number(order.savings).toLocaleString("en-IN")}`, pageW - 15, totalsY + 7, { align: "right" });

    // Total payable bold line
    doc.setDrawColor(15, 52, 96);
    doc.setLineWidth(0.5);
    doc.line(totalsX - 5, totalsY + 12, pageW - 15, totalsY + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 52, 96);
    doc.text("TOTAL PAYABLE:", totalsX, totalsY + 20);
    doc.text(`Rs. ${Number(order.total).toLocaleString("en-IN")}`, pageW - 15, totalsY + 20, { align: "right" });

    // ── Footer ──
    const footerY = afterTableY + 55;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(15, footerY, pageW - 15, footerY);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Thank you for your order! Have a safe and happy Diwali!", pageW / 2, footerY + 7, { align: "center" });
    doc.text("For queries, contact us on WhatsApp: +91 73730 73989", pageW / 2, footerY + 13, { align: "center" });

    return doc;
  };

  const downloadPDF = (order) => {
    try {
      const doc = generatePDF(order);
      doc.save(`Jayasuriya_Order_${order.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const sharePDF = async (order) => {
    try {
      const doc = generatePDF(order);
      const pdfBlob = doc.output("blob");
      const filename = `Jayasuriya_Order_${order.name.replace(/\s+/g, "_")}.pdf`;
      const file = new File([pdfBlob], filename, { type: "application/pdf" });

      await navigator.share({
        files: [file],
        title: "Jayasuriya Crackers Invoice",
        text: `Here is the order invoice for ${order.name}.`,
      });
    } catch (err) {
      console.error("Error sharing PDF invoice:", err);
      downloadPDF(order);
    }
  };

  const handleCheckout = async () => {
    if (!customerName.trim() || !mobileNumber || !address.trim() || !email.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (mobileNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      let pdfBase64 = "";
      try {
        const doc = generatePDF({
          items: [...cart],
          total,
          savings: totalSavings,
          name: customerName,
          mobile: mobileNumber,
          address: address.trim(),
        });
        pdfBase64 = doc.output("datauristring").split(",")[1];
      } catch (pdfErr) {
        console.error("PDF generation for placement failed:", pdfErr);
      }

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
          pdfFile: pdfBase64,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const pdfUrl = responseData.pdfUrl || "";

        const orderData = {
          items: [...cart],
          total,
          savings: totalSavings,
          name: customerName,
          mobile: mobileNumber,
          address: address.trim(),
          pdfUrl,
        };

        setPlacedOrder(orderData);
        setOrderSuccess(true);
        triggerCelebration();

        // Open WhatsApp tab immediately (must be synchronous – inside user gesture context)
        // Browsers block window.open inside setTimeout/async callbacks
        const waLink = generateWhatsAppLink(orderData, pdfUrl);
        window.open(waLink, "_blank");

        // Download PDF (browser handles this as a file download, gesture not needed)
        downloadPDF(orderData);

        clearCart();
        setCustomerName("");
        setMobileNumber("");
        setAddress("");
        setEmail("");
      } else {
        const data = await response.json();
        alert("Error: " + (data.error || "Failed to place order"));
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ─── Styles ────────────────────────────────────────────────────
  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    opacity: 0.6,
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div style={{ padding: "32px 16px", maxWidth: "1280px", margin: "0 auto" }}>

      {/* ── Page Title ── */}
      <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", marginBottom: "6px" }}>🛒 Your Cart</h1>
        <p style={{ opacity: 0.5, fontSize: "0.95rem" }}>Review your items, fill in your details, and place your order</p>
      </div>

      {/* ── ORDER SUCCESS SCREEN ── */}
      {orderSuccess && placedOrder ? (
        <div className="animate-fade-in" style={{ ...cardStyle, padding: "48px 24px", border: "1px solid rgba(76,175,80,0.4)", textAlign: "center" }}>
          <div style={{ fontSize: "5rem", lineHeight: 1 }}>🎉</div>
          <h2 style={{ color: "#4CAF50", marginTop: "16px", fontSize: "2rem" }}>Order Placed Successfully!</h2>
          <p style={{ opacity: 0.7, marginTop: "8px", fontSize: "1.05rem" }}>Happy Diwali! Your order is confirmed.</p>

          {/* Order Summary Card */}
          <div style={{ maxWidth: "600px", margin: "32px auto 0", textAlign: "left", ...cardStyle, padding: "28px" }}>
            <h3 style={{ margin: "0 0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px", fontSize: "1.1rem", color: "var(--accent)" }}>
              Order Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem", marginBottom: "20px" }}>
              <div style={{ opacity: 0.6 }}>Customer</div><div style={{ fontWeight: 600 }}>{placedOrder.name}</div>
              <div style={{ opacity: 0.6 }}>Mobile</div><div style={{ fontWeight: 600 }}>{placedOrder.mobile}</div>
              <div style={{ opacity: 0.6 }}>Address</div><div style={{ fontWeight: 600 }}>{placedOrder.address}</div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
              {placedOrder.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed rgba(255,255,255,0.06)", fontSize: "0.9rem" }}>
                  <span style={{ opacity: 0.85 }}>{item.name} <span style={{ opacity: 0.5 }}>×{item.quantity}</span></span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>₹{((item.sellingPrice || item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "0.9rem", color: "#4CAF50" }}>
                <span>Diwali Savings</span>
                <span>-₹{placedOrder.savings.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "1.3rem", fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "10px" }}>
                <span>Total Paid</span>
                <span style={{ color: "var(--accent)" }}>₹{placedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", marginTop: "32px" }}>
            <a
              href={generateWhatsAppLink(placedOrder, placedOrder.pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button"
              style={{ backgroundColor: "#25D366", color: "white", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", fontSize: "1rem", borderRadius: "50px", boxShadow: "0 6px 20px rgba(37,211,102,0.35)", fontWeight: 700 }}
            >
              <span>📱</span> Send via WhatsApp
            </a>
            {canShare && (
              <button
                onClick={() => sharePDF(placedOrder)}
                className="premium-button"
                style={{ backgroundColor: "#8b5cf6", color: "white", display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", fontSize: "1rem", borderRadius: "50px", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.35)", fontWeight: 700, border: "none" }}
              >
                <span>📤</span> Share Invoice File
              </button>
            )}
            <button
              onClick={() => downloadPDF(placedOrder)}
              className="premium-button"
              style={{ backgroundColor: "#0ea5e9", color: "white", display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", fontSize: "1rem", borderRadius: "50px", cursor: "pointer", boxShadow: "0 6px 20px rgba(14,165,233,0.35)", fontWeight: 700, border: "none" }}
            >
              <span>📄</span> Download Invoice
            </button>
          </div>

          <button
            onClick={() => { setOrderSuccess(false); setPlacedOrder(null); }}
            style={{ marginTop: "24px", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.9rem", textDecoration: "underline" }}
          >
            ← Continue Shopping
          </button>
        </div>

      ) : cart.length === 0 ? (
        /* ── EMPTY CART ── */
        <div className="animate-fade-in" style={{ ...cardStyle, textAlign: "center", padding: "100px 24px" }}>
          <div style={{ fontSize: "4.5rem" }}>🛒</div>
          <h2 style={{ marginTop: "20px", fontSize: "1.6rem" }}>Your cart is empty</h2>
          <p style={{ opacity: 0.5, marginTop: "8px" }}>Add some amazing fireworks and celebrate Diwali!</p>
        </div>

      ) : (
        /* ── MAIN CART VIEW ── */
        <div className="cart-layout">

          {/* ─── LEFT: Cart Items ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", marginBottom: "4px" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", opacity: 0.8, fontWeight: 600 }}>
                {cart.reduce((s, i) => s + i.quantity, 0)} items in your cart
              </h2>
            </div>

            {cart.map((item, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  transition: "border-color 0.3s",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={item.image || item.imageUrl || "https://via.placeholder.com/80"}
                    alt={item.name}
                    style={{ width: "76px", height: "76px", objectFit: "cover", borderRadius: "12px", display: "block" }}
                  />
                  {item.discount > 0 && (
                    <div style={{ position: "absolute", top: "-8px", right: "-8px", background: "linear-gradient(135deg,#ff6600,#ff4500)", color: "white", padding: "3px 7px", borderRadius: "8px", fontSize: "0.65rem", fontWeight: 700 }}>
                      -{item.discount}%
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h3>
                  <p style={{ margin: 0, opacity: 0.5, fontSize: "0.8rem" }}>{item.category}</p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.1rem" }}>₹{(item.sellingPrice || item.price).toLocaleString()}</span>
                    {item.mrp && <span style={{ textDecoration: "line-through", opacity: 0.35, fontSize: "0.85rem" }}>₹{item.mrp.toLocaleString()}</span>}
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "7px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >−</button>
                    <span style={{ minWidth: "24px", textAlign: "center", fontWeight: 700, fontSize: "0.95rem" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "7px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: "rgba(255,68,68,0.1)", color: "#ff5555", border: "1px solid rgba(255,68,68,0.2)", width: "36px", height: "36px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,68,68,0.1)"; e.currentTarget.style.color = "#ff5555"; }}
                  >🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* ─── RIGHT: Checkout Panel ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Customer Details Form */}
            <div style={{ ...cardStyle, padding: "28px" }}>
              <h2 style={{ margin: "0 0 24px", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: "linear-gradient(135deg,#ff6600,#ff4500)", padding: "6px 10px", borderRadius: "10px", fontSize: "1rem" }}>📋</span>
                Checkout Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <input
                    type="tel"
                    style={inputStyle}
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Delivery Address</label>
                  <textarea
                    style={{ ...inputStyle, height: "90px", resize: "vertical", fontFamily: "inherit" }}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ ...cardStyle, padding: "28px", border: "1px solid rgba(255,215,0,0.25)" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: "linear-gradient(135deg,#ffd700,#ff8c00)", padding: "6px 10px", borderRadius: "10px", fontSize: "1rem" }}>💰</span>
                Order Summary
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.75, fontSize: "0.95rem" }}>
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{originalTotal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#4ade80", fontSize: "0.95rem" }}>
                    <span>🎊 Diwali Savings</span>
                    <span>-₹{totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="premium-button"
                style={{ width: "100%", marginTop: "24px", padding: "16px", fontSize: "1.1rem", borderRadius: "14px", cursor: isPlacingOrder ? "not-allowed" : "pointer", opacity: isPlacingOrder ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", border: "none" }}
              >
                {isPlacingOrder ? (
                  <>⏳ Placing Order...</>
                ) : (
                  <>🚀 Place Diwali Order</>
                )}
              </button>

              <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.78rem", opacity: 0.4 }}>
                PDF invoice will auto-download &amp; WhatsApp will open after order placement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;