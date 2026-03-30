import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SUBJECTS = ["Math", "English / Writing", "Science", "History", "Reading", "Test Prep (SAT/ACT)"];
const GRADES = ["K-2", "3-5", "6-8", "9-12"];
const LANGUAGES = ["English", "Spanish"];

export default function Signup() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") || "student");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    gradeLevel: "", subjects: [], language: "English",
    bio: "", availability: "",
  });

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  function toggleSubject(s) {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Passwords don't match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.subjects.length === 0) return setError("Please select at least one subject.");
    setError(""); setLoading(true);
    try {
      await signup(form.email, form.password, {
        firstName: form.firstName,
        lastName: form.lastName,
        role,
        gradeLevel: form.gradeLevel,
        subjects: form.subjects,
        language: form.language,
        bio: form.bio,
        availability: form.availability,
        displayName: `${form.firstName} ${form.lastName}`,
      });
      navigate(role === "tutor" ? "/tutor-dashboard" : "/student-dashboard");
    } catch (err) {
      setError(err.message.includes("email-already-in-use") ? "That email is already registered." : "Signup failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← Back to home</Link>

        {/* Role toggle */}
        <div style={styles.roleToggle}>
          <button
            className={role === "student" ? "btn btn-primary" : "btn btn-ghost"}
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => setRole("student")}
            type="button"
          >
            🎒 I'm a student
          </button>
          <button
            className={role === "tutor" ? "btn btn-primary" : "btn btn-ghost"}
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => setRole("tutor")}
            type="button"
          >
            👩‍🏫 I'm a tutor
          </button>
        </div>

        <div className="card">
          <h1 style={styles.title}>
            {role === "student" ? "Find your tutor" : "Become a volunteer tutor"}
          </h1>
          <p style={styles.subtitle}>
            {role === "student"
              ? "Create a free account to get matched with a tutor."
              : "Help newcomer students learn — it's free and flexible."}
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>First Name</label>
                <input required value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input required value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last name" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={e => set("password", e.target.value)} placeholder="At least 6 characters" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" required value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Repeat password" />
            </div>

            <div className="form-group">
              <label>{role === "student" ? "Your grade level" : "Your grade in school"}</label>
              <select value={form.gradeLevel} onChange={e => set("gradeLevel", e.target.value)} required>
                <option value="">Select grade level</option>
                {role === "student"
                  ? GRADES.map(g => <option key={g} value={g}>{g}</option>)
                  : ["9", "10", "11", "12"].map(g => <option key={g} value={g}>Grade {g}</option>)
                }
              </select>
            </div>

            <div className="form-group">
              <label>{role === "student" ? "What subjects do you need help with?" : "What subjects can you tutor?"}</label>
              <div style={styles.subjectsGrid}>
                {SUBJECTS.map(s => (
                  <label key={s} style={styles.subjectLabel}>
                    <input
                      type="checkbox"
                      checked={form.subjects.includes(s)}
                      onChange={() => toggleSubject(s)}
                      style={{ marginRight: 6 }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred language</label>
              <select value={form.language} onChange={e => set("language", e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {role === "tutor" && (
              <>
                <div className="form-group">
                  <label>Short bio <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
                  <textarea
                    value={form.bio}
                    onChange={e => set("bio", e.target.value)}
                    placeholder="Tell students a bit about yourself and why you want to help..."
                    rows={3}
                    style={{ resize: "vertical", padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 15, outline: "none" }}
                  />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <input
                    value={form.availability}
                    onChange={e => set("availability", e.target.value)}
                    placeholder="e.g. Weekday evenings, Saturday mornings"
                  />
                  <span className="hint">Students will see this when browsing tutors.</span>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 16, marginTop: 8 }}
              disabled={loading}
            >
              {loading ? "Creating account..." : `Create ${role === "student" ? "student" : "tutor"} account →`}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--green)", fontWeight: 500 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", padding: "40px 16px" },
  container: { maxWidth: 520, margin: "0 auto" },
  back: { display: "inline-block", color: "var(--text-muted)", fontSize: 14, marginBottom: 20 },
  roleToggle: {
    display: "flex",
    gap: 8,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  title: { fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 },
  subtitle: { color: "var(--text-muted)", fontSize: 15, marginBottom: 24 },
  subjectsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  subjectLabel: { display: "flex", alignItems: "center", fontSize: 14, cursor: "pointer" },
};
