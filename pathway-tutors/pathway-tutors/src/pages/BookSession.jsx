import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const SUBJECTS = ["Math", "English / Writing", "Science", "History", "Reading", "Test Prep (SAT/ACT)"];
const TIMES = ["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"];

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookSession() {
  const { tutorId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ subject: "", date: "", time: "", notes: "" });

  const days = getNext7Days();

  useEffect(() => {
    if (!currentUser) { navigate("/signup?role=student"); return; }
    async function load() {
      const snap = await getDoc(doc(db, "users", tutorId));
      if (snap.exists()) setTutor({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    load();
  }, [tutorId, currentUser]);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject || !form.date || !form.time) return setError("Please fill in all required fields.");
    setError(""); setSubmitting(true);

    try {
      // Create session in Firestore
      const sessionRef = await addDoc(collection(db, "sessions"), {
        tutorId,
        studentId: currentUser.uid,
        tutorName: tutor.displayName,
        studentName: userProfile?.displayName || currentUser.email,
        subject: form.subject,
        date: form.date,
        time: form.time,
        notes: form.notes,
        status: "pending",
        createdAt: serverTimestamp(),
        zoomLink: null,
      });

      // Call our Zoom function via Vercel edge function
      // For now we store the session and the tutor will confirm + Zoom link appears
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
    setSubmitting(false);
  }

  if (loading) return <div className="spinner" />;
  if (!tutor) return <div className="page-container" style={{ padding: 40 }}>Tutor not found.</div>;

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div className="card" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Session Requested!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              Your session with <strong>{tutor.displayName}</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong> has been requested.
              <br /><br />
              Once {tutor.firstName} confirms, you'll receive a Zoom meeting link in your dashboard.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link to="/student-dashboard" className="btn btn-primary">Go to my dashboard →</Link>
              <Link to="/tutors" className="btn btn-outline">Browse more tutors</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/tutors" style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-block", marginBottom: 20 }}>← Back to tutors</Link>

        {/* Tutor info card */}
        <div className="card" style={styles.tutorCard}>
          <div style={styles.tutorHeader}>
            <div style={styles.avatar}>{tutor.firstName?.[0] || "T"}</div>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{tutor.displayName}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Grade {tutor.gradeLevel} · {tutor.language}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {(tutor.subjects || []).map(s => <span key={s} className="tag" style={{ fontSize: 12 }}>{s}</span>)}
          </div>
        </div>

        {/* Booking form */}
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={styles.formTitle}>Book a Session</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Subject *</label>
              <select value={form.subject} onChange={e => set("subject", e.target.value)} required>
                <option value="">Choose a subject...</option>
                {(tutor.subjects || SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Choose a date *</label>
              <div style={styles.daysGrid}>
                {days.map(d => {
                  const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                  const val = d.toISOString().split("T")[0];
                  return (
                    <button
                      key={val} type="button"
                      onClick={() => set("date", val)}
                      style={{
                        ...styles.dayBtn,
                        background: form.date === val ? "var(--green)" : "white",
                        color: form.date === val ? "white" : "var(--text)",
                        borderColor: form.date === val ? "var(--green)" : "var(--border)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Choose a time *</label>
              <div style={styles.timesGrid}>
                {TIMES.map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => set("time", t)}
                    style={{
                      ...styles.timeBtn,
                      background: form.time === t ? "var(--green)" : "white",
                      color: form.time === t ? "white" : "var(--text)",
                      borderColor: form.time === t ? "var(--green)" : "var(--border)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notes for your tutor <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
              <textarea
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                placeholder="What specific topics do you need help with? Any context that would help your tutor prepare..."
                rows={3}
                style={{ resize: "vertical", padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 15, outline: "none", width: "100%" }}
              />
            </div>

            <div style={styles.zoomNote}>
              <span>📹</span>
              <span>A Zoom meeting link will be automatically created when your tutor confirms.</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 16, marginTop: 8 }}
            >
              {submitting ? "Requesting..." : "Request this session →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px 0", minHeight: "100vh" },
  container: { maxWidth: 580, margin: "0 auto", padding: "0 16px" },
  tutorCard: { display: "flex", flexDirection: "column" },
  tutorHeader: { display: "flex", alignItems: "center", gap: 16 },
  avatar: {
    width: 52, height: 52, borderRadius: "50%",
    background: "var(--green-light)", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 22, fontWeight: 700, color: "var(--green)", flexShrink: 0,
  },
  formTitle: { fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20 },
  daysGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 },
  dayBtn: { padding: "10px 8px", borderRadius: 8, border: "1.5px solid", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" },
  timesGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  timeBtn: { padding: "10px 4px", borderRadius: 8, border: "1.5px solid", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" },
  zoomNote: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#eff6ff", border: "1px solid #bfdbfe",
    borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#1d4ed8",
    marginBottom: 16,
  },
};
