import { Link } from "react-router-dom";

const SUBJECTS = ["Math", "English", "Science", "History", "Reading", "Writing", "Test Prep"];

const STEPS = [
  { icon: "📝", title: "Create an account", desc: "Sign up as a student or volunteer tutor in under 2 minutes." },
  { icon: "🔍", title: "Get matched", desc: "Browse available tutors by subject, grade level, or language." },
  { icon: "📅", title: "Book a session", desc: "Pick a time that works. We'll create a Zoom link automatically." },
  { icon: "🎓", title: "Start learning", desc: "Join your 1-on-1 session and get the help you need — for free." },
];

const TESTIMONIALS = [
  { name: "Maria, 4th grade", quote: "My tutor helped me understand fractions. Now I love math!", flag: "🇲🇽" },
  { name: "Ahmed, 7th grade", quote: "I came to America not knowing English. My tutor was so patient.", flag: "🇸🇾" },
  { name: "Anh, 5th grade", quote: "I got a B+ on my science test after just 3 sessions!", flag: "🇻🇳" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroText}>
            <div style={styles.heroBadge}>🌍 Free tutoring for newcomer students</div>
            <h1 style={styles.heroH1}>
              Every student deserves<br />
              <em style={{ color: "var(--green)" }}>a great tutor.</em>
            </h1>
            <p style={styles.heroSub}>
              PathwayTutors connects immigrant and ENL students with caring high school volunteer tutors for free 1-on-1 Zoom sessions.
            </p>
            <div style={styles.heroCta}>
              <Link to="/signup?role=student" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 28px" }}>
                I need a tutor →
              </Link>
              <Link to="/signup?role=tutor" className="btn btn-outline" style={{ fontSize: 16, padding: "14px 28px" }}>
                I want to volunteer
              </Link>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
              100% free · No credit card · Available in English & Español
            </p>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.heroCard}>
              <div style={styles.heroCardHeader}>
                <span style={styles.avatarCircle}>👩‍🏫</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Sarah K.</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Grade 11 · Math & Science</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: "auto" }}>Available</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {["Algebra", "Biology", "Chemistry"].map(s => <span key={s} className="tag">{s}</span>)}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }}>
                📅 Book a Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects bar */}
      <section style={styles.subjectsBar}>
        <div className="page-container">
          <p style={styles.subjectsLabel}>Available subjects:</p>
          <div style={styles.subjectsList}>
            {SUBJECTS.map(s => (
              <span key={s} className="tag" style={{ fontSize: 14, padding: "6px 16px" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.section}>
        <div className="page-container">
          <h2 style={styles.sectionTitle}>How it works</h2>
          <p style={styles.sectionSub}>Getting help has never been easier.</p>
          <div style={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepIcon}>{step.icon}</div>
                <div style={styles.stepNum}>Step {i + 1}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...styles.section, background: "var(--green-light)" }}>
        <div className="page-container">
          <h2 style={styles.sectionTitle}>Student stories</h2>
          <div style={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={styles.testimonialCard}>
                <div style={styles.testimonialFlag}>{t.flag}</div>
                <p style={styles.testimonialQuote}>"{t.quote}"</p>
                <p style={styles.testimonialName}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "white", marginBottom: 12 }}>
            Ready to get started?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, marginBottom: 28 }}>
            Join hundreds of students finding their path forward.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup?role=student" className="btn" style={{ background: "white", color: "var(--green)", fontSize: 16, padding: "13px 28px" }}>
              Sign up as a student
            </Link>
            <Link to="/signup?role=tutor" className="btn" style={{ background: "transparent", color: "white", border: "2px solid white", fontSize: 16, padding: "13px 28px" }}>
              Become a tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="page-container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green)", marginBottom: 4 }}>🌱 PathwayTutors</div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Free tutoring for newcomer students.</p>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 24 }}>
            <Link to="/about">About</Link>
            <Link to="/tutors">Find a Tutor</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="page-container" style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
          © 2025 PathwayTutors · A nonprofit volunteer project
        </div>
      </footer>
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%)",
    padding: "72px 0 60px",
  },
  heroInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 48,
    flexWrap: "wrap",
  },
  heroText: { flex: 1, minWidth: 300 },
  heroBadge: {
    display: "inline-block",
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    color: "var(--green)",
    fontWeight: 500,
    marginBottom: 20,
  },
  heroH1: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(36px, 5vw, 52px)",
    lineHeight: 1.15,
    marginBottom: 18,
    color: "var(--text)",
  },
  heroSub: {
    fontSize: 17,
    color: "var(--text-muted)",
    lineHeight: 1.7,
    marginBottom: 28,
    maxWidth: 480,
  },
  heroCta: { display: "flex", gap: 14, flexWrap: "wrap" },
  heroVisual: { flex: "0 0 320px" },
  heroCard: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 32px rgba(26,107,74,0.12)",
    border: "1px solid var(--border)",
  },
  heroCardHeader: { display: "flex", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    background: "var(--green-light)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
  subjectsBar: {
    background: "white",
    borderBottom: "1px solid var(--border)",
    padding: "16px 0",
  },
  subjectsLabel: {
    fontSize: 13,
    color: "var(--text-muted)",
    fontWeight: 500,
    marginBottom: 10,
  },
  subjectsList: { display: "flex", flexWrap: "wrap", gap: 8 },
  section: { padding: "72px 0" },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 36,
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSub: {
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: 16,
    marginBottom: 48,
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 24,
  },
  stepCard: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 28,
    textAlign: "center",
  },
  stepIcon: { fontSize: 36, marginBottom: 10 },
  stepNum: { fontSize: 12, color: "var(--green)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  stepTitle: { fontSize: 17, fontWeight: 600, marginBottom: 8 },
  stepDesc: { fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 },
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
  },
  testimonialCard: { textAlign: "center" },
  testimonialFlag: { fontSize: 36, marginBottom: 12 },
  testimonialQuote: { fontSize: 15, fontStyle: "italic", color: "var(--text)", lineHeight: 1.7, marginBottom: 12 },
  testimonialName: { fontSize: 13, color: "var(--text-muted)", fontWeight: 500 },
  ctaBanner: {
    background: "var(--green)",
    padding: "72px 0",
  },
  footer: {
    background: "white",
    borderTop: "1px solid var(--border)",
    padding: "40px 0 24px",
  },
};
