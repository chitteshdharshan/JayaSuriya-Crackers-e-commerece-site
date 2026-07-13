import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      alert("❌ Please enter a password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://jayasuriya-crackers-e-commerece-site-1.onrender.com/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error || "Invalid Password"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="product-card animate-fade-in" style={{
        padding: "40px",
        borderRadius: "20px",
        maxWidth: "400px",
        width: "100%",
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: "10px" }}>🔐 Admin Login</h1>
        <p style={{ marginBottom: "30px", opacity: 0.7, fontSize: "0.9rem" }}>
          Secure access for inventory management
        </p>

        <form onSubmit={handleVerifyPassword} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.85rem", opacity: 0.8 }}>
              Password
            </label>
            <input
              type="password"
              className="search-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="premium-button"
            style={{ width: '100%' }}
          >
            {loading ? "🔄 Verifying..." : "🔓 Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;