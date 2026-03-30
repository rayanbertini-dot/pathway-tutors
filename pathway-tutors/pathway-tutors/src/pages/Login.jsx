import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, userProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const result = await login(email, password);
      // Small delay to let profile load
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      setError("Incorrect email or password. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← Back to home</Link>
        <div className="card">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 40 }}>🌱</span>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.subtitle}>Log in to your PathwayTutors account</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account? <Link to="/signup" style={{ color: "var(--green)", fontWeight: 500 }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", padding: "80px 16px" },
  container: { maxWidth: 420, margin: "0 auto" },
  back: { display: "inline-block", color: "var(--text-muted)", fontSize: 14, marginBottom: 20 },
  title: { fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 6, marginTop: 8 },
  subtitle: { color: "var(--text-muted)", fontSize: 15 },
};
