import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "15px"
    }}>
      <div style={{
        backgroundColor: "var(--card-bg)",
        padding: "25px",
        borderRadius: "10px",
        border: `1px solid var(--border-color)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          marginBottom: "10px", 
          color: "var(--accent-color)",
          fontSize: "1.6rem"
        }}>
          🔐 Admin Login
        </h1>
        <p style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          opacity: "0.8",
          fontSize: "0.85rem"
        }}>
          Access the product management system
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "11px",
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
          >
            ✅ Login
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          marginTop: "15px", 
          fontSize: "0.8rem", 
          opacity: "0.7",
          lineHeight: "1.6"
        }}>
          <p style={{ margin: "3px 0" }}>Demo Credentials:</p>
          <p style={{ margin: "3px 0" }}>Username: admin</p>
          <p style={{ margin: "3px 0" }}>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;