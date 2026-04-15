import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin }) {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send"); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
          {step === "send" ? "Secure access for inventory management" : "Enter the verification code sent to your email"}
        </p>

        {step === "send" ? (
          <form onSubmit={handleSendOtp}>
            <button
              type="submit"
              disabled={loading}
              className="premium-button"
              style={{ width: '100%' }}
            >
              {loading ? "📤 Sending OTP..." : "📧 Send OTP to Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.85rem", opacity: 0.8 }}>
                Verification Code
              </label>
              <input
                type="text"
                className="search-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                required
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem' }}
              />
              <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "8px" }}>
                Sent to registered administrator email
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep("send")}
                className="nav-link"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: '1px solid var(--border)',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="premium-button"
                style={{ flex: 1 }}
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