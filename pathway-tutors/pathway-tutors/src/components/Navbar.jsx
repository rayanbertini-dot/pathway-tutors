import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌱</span>
          <span style={styles.logoText}>PathwayTutors</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <Link to="/tutors" style={styles.link}>Find a Tutor</Link>
          <Link to="/about" style={styles.link}>About</Link>
          {currentUser ? (
            <>
              <Link
                to={userProfile?.role === "tutor" ? "/tutor-dashboard" : "/student-dashboard"}
                className="btn btn-outline"
                style={{ padding: "8px 18px", fontSize: 14 }}
              >
                My Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: 14 }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Log in</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/tutors" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Find a Tutor</Link>
          <Link to="/about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
          {currentUser ? (
            <>
              <Link
                to={userProfile?.role === "tutor" ? "/tutor-dashboard" : "/student-dashboard"}
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                My Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={styles.mobileLink}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" style={{ ...styles.mobileLink, color: "var(--green)", fontWeight: 600 }} onClick={() => setMenuOpen(false)}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    background: "white",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: { fontSize: 24 },
  logoText: {
    fontSize: 20,
    fontFamily: "var(--font-display)",
    color: "var(--green)",
    fontWeight: 400,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  link: {
    fontSize: 15,
    color: "var(--text-muted)",
    fontWeight: 500,
    transition: "color 0.2s",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    "@media(maxWidth:768px)": { display: "block" },
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 24px 20px",
    borderTop: "1px solid var(--border)",
    background: "white",
  },
  mobileLink: {
    padding: "12px 0",
    fontSize: 16,
    color: "var(--text)",
    borderBottom: "1px solid var(--border)",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
  },
};
