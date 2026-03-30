import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={{ padding: "60px 0", minHeight: "100vh" }}>
      <div className="page-container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, marginBottom: 16 }}>
          About PathwayTutors
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 40 }}>
          PathwayTutors is a nonprofit volunteer project founded by two high school students who believe every newcomer student deserves a fair chance to succeed academically.
        </p>

        <div className="card" style={{ marginBottom: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
          <span style={{ fontSize: 36 }}>🌍</span>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Our Mission</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              We connect immigrant and ENL (English as a New Language) students — especially elementary and middle school kids who are new to the country — with caring high school volunteer tutors for free 1-on-1 Zoom sessions.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
          <span style={{ fontSize: 36 }}>🤝</span>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>How We Work</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Students sign up and browse available tutors by subject, grade level, and language. They book a session with a single click. Our platform automatically creates a Zoom meeting link, and the tutor connects with the student at the scheduled time — no cost, no hassle.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 40, display: "flex", gap: 20, alignItems: "flex-start" }}>
          <span style={{ fontSize: 36 }}>🏫</span>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Who We Serve</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              We primarily serve immigrant students in ENL programs, grades K–12, with a focus on younger students (K–5) who are just beginning to learn English. We currently offer tutoring in English and Spanish. All tutoring is completely free.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link to="/signup?role=student" className="btn btn-primary" style={{ fontSize: 16, padding: "13px 28px" }}>
            Get free tutoring →
          </Link>
          <Link to="/signup?role=tutor" className="btn btn-outline" style={{ fontSize: 16, padding: "13px 28px" }}>
            Volunteer as a tutor
          </Link>
        </div>
      </div>
    </div>
  );
}
