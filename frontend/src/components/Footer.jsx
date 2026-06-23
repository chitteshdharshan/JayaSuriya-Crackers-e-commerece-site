export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg, #0a0a0c 0%, #0d0d14 100%)",
      borderTop: "1px solid rgba(255,215,0,0.15)",
      marginTop: "60px",
      padding: "60px 20px 30px",
      color: "#ccc",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "50px",
        marginBottom: "50px",
      }}>

        {/* About Us */}
        <div>
          <h2 style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            background: "linear-gradient(to right, #fff, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
          }}>
            🎆 Jayasuriya Crackers
          </h2>
          <p style={{ lineHeight: "1.8", fontSize: "0.92rem", color: "#aaa", marginBottom: "14px" }}>
            Trusted by families across Tamil Nadu for over <strong style={{ color: "#ffd700" }}>10+ years</strong>,
            Jayasuriya Crackers is a name synonymous with quality, safety, and celebration. From humble beginnings
            in the heart of Sivakasi — the fireworks capital of India — we have grown into one of the most
            loved cracker stores in the region.
          </p>
          <p style={{ lineHeight: "1.8", fontSize: "0.92rem", color: "#aaa" }}>
            Every product we sell is carefully sourced, safety-tested, and priced to give you the
            best value without compromise. Your joy is our mission — every single Diwali, every single day. 🪔
          </p>
        </div>

        {/* Why Choose Us */}
        <div>
          <h3 style={{ color: "#ffd700", marginBottom: "20px", fontSize: "1.1rem", fontWeight: 700 }}>
            ✨ Why Customers Love Us
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "🏆", text: "10+ Years of trusted service" },
              { icon: "🔒", text: "100% certified & safety-approved crackers" },
              { icon: "💰", text: "Factory-direct prices — no middleman" },
              { icon: "🚀", text: "Fast & reliable delivery to your doorstep" },
              { icon: "❤️", text: "10,000+ happy customers & counting" },
              { icon: "📞", text: "Personal support — we know your name!" },
              { icon: "🎁", text: "Exclusive festive gift packs & bulk deals" },
            ].map(({ icon, text }) => (
              <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.9rem", color: "#bbb" }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Address */}
        <div>
          <h3 style={{ color: "#ffd700", marginBottom: "20px", fontSize: "1.1rem", fontWeight: 700 }}>
            📍 Visit Us
          </h3>

          <div style={{
            background: "rgba(255,215,0,0.05)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}>
            <p style={{ margin: 0, lineHeight: "1.9", fontSize: "0.92rem", color: "#ccc" }}>
              <strong style={{ color: "#fff" }}>Jayasuriya Crackers</strong><br />
              3/1016/4, Jayaram Complex,<br />
              Paraipatti, Sattur Road,<br />
              CONTACT: 944275989<br />
              Sivakasi — 626 189<br />
              Tamil Nadu, India 🇮🇳
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="https://maps.google.com/?q=Jayasuriya+Crackers+Sivakasi"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffd700",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 600,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              🗺️ Get Directions on Google Maps
            </a>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#25D366",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 600,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              💬 Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "20px 0",
        marginBottom: "30px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px",
      }}>
        {[
          { number: "10+", label: "Years in Business" },
          { number: "10,000+", label: "Happy Customers" },
          { number: "500+", label: "Products Available" },
          { number: "100%", label: "Safety Certified" },
        ].map(({ number, label }) => (
          <div key={label} style={{ textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffd700" }}>{number}</div>
            <div style={{ fontSize: "0.78rem", color: "#888", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div style={{
        textAlign: "center",
        fontSize: "0.82rem",
        color: "#555",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <p style={{ margin: "0 0 6px" }}>
          Made with ❤️ in Sivakasi — The Fireworks Capital of India 🎆
        </p>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Jayasuriya Crackers. All rights reserved.
          &nbsp;|&nbsp; Celebrate responsibly. 🪔
        </p>
      </div>
    </footer>
  );
}
