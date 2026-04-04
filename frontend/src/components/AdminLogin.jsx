import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin }) {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send"); // "send" or "verify"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/admin/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        setStep("verify");
        alert("✅ OTP sent to your email");
      } else {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error || "Failed to send OTP"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      alert("❌ Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      if (res.ok) {
        setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error || "Invalid OTP"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: `1px solid var(--border-color)`,
    backgroundColor: "var(--bg-color)",
    color: "var(--text-color)",
    fontSize: "0.9rem",
    boxSizing: "border-box"
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
          {step === "send" ? "Click to receive OTP via email" : "Enter the 6-digit OTP sent to your email"}
        </p>

        {step === "send" ? (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "11px",
                background: loading ? "#666" : "var(--accent-color)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
                fontWeight: "bold",
                transition: "background-color 0.3s"
              }}
            >
              {loading ? "📤 Sending OTP..." : "📧 Send OTP to Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                required
                style={inputStyle}
              />
              <p style={{ fontSize: "0.8rem", color: "#888", margin: "5px 0" }}>
                OTP sent to chitteshdharshan14@gmail.com
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep("send")}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "var(--hover-bg)",
                  color: "var(--text-color)",
                  border: `1px solid var(--border-color)`,
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold"
                }}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: loading ? "#666" : "var(--accent-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  transition: "background-color 0.3s"
                }}
              >
                {loading ? "🔄 Verifying..." : "🔓 Login"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;