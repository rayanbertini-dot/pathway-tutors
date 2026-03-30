import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const SUBJECTS = ["Math", "English / Writing", "Science", "History", "Reading", "Test Prep (SAT/ACT)", "Other"];
const GRADES = ["K-2", "3-5", "6-8", "9-12"];

export default function RequestTutor() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    subject: "", gradeLevel: "", language: "English",
    availability: "", description: "", contactEmail: currentUser?.email || "",
  });

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject || !form.gradeLevel) return setError("Please fill in all required fields.");
    setError(""); setLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        studentId: currentUser?.uid || null,
        studentName: userProfile?.displayName || "Anonymous",
        status: "open",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "60px 16px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Create an account first</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>You need a free student account to request a tutor.</p>
        <Link to="/signup?role=student" className="btn btn-primary">Sign up free</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Request Submitted!</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 24 }}>
            We've received your tutoring request. A volunteer tutor will reach out soon, or you can also browse and book directly.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/tutors" className="btn btn-primary">Browse tutors now</Link>
            <Link to="/student-dashboard" className="btn btn-outline">My dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0", minHeight: "100vh" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>
        <Link to="/tutors" style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-block", marginBottom: 20 }}>← Back to tutors</Link>
        <div className="card">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 }}>Request a Tutor</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 24 }}>
            Can't find the right tutor? Submit a request and we'll match you!
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject needed *</label>
              <select value={form.subject} onChange={e => set("subject", e.target.value)} required>
                <option value="">Choose a subject...</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Grade level *</label>
              <select value={form.gradeLevel} onChange={e => set("gradeLevel", e.target.value)} required>
                <option value="">Select grade level...</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Preferred language</label>
              <select value={form.language} onChange={e => set("language", e.target.value)}>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div className="form-group">
              <label>When are you available?</label>
              <input
                value={form.availability}
                onChange={e => set("availability", e.target.value)}
                placeholder="e.g. Weekday evenings, Saturdays"
              />
            </div>

            <div className="form-group">
              <label>Tell us more <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="What specific topics do you need help with? Any other details..."
                rows={3}
                style={{ resize: "vertical", padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 15, outline: "none", width: "100%" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 16 }}
            >
              {loading ? "Submitting..." : "Submit Request →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
