import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const STATUS_STYLES = {
  pending: { badge: "badge-gold", label: "⏳ Pending" },
  confirmed: { badge: "badge-green", label: "✅ Confirmed" },
  completed: { badge: "badge-gray", label: "✓ Completed" },
  cancelled: { badge: "badge-gray", label: "✕ Cancelled" },
};

export default function StudentDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "sessions"),
          where("studentId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => (a.date > b.date ? 1 : -1));
        setSessions(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    loadSessions();
  }, [currentUser]);

  const upcoming = sessions.filter(s => s.status === "confirmed" || s.status === "pending");
  const past = sessions.filter(s => s.status === "completed" || s.status === "cancelled");

  return (
    <div style={styles.page}>
      <div className="page-container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {userProfile?.firstName}! 👋</h1>
            <p style={styles.subtitle}>Here are your upcoming tutoring sessions.</p>
          </div>
          <Link to="/tutors" className="btn btn-primary">+ Book a session</Link>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{sessions.length}</div>
            <div style={styles.statLabel}>Total Sessions</div>
          </div>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{upcoming.length}</div>
            <div style={styles.statLabel}>Upcoming</div>
          </div>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{past.filter(s => s.status === "completed").length}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            <h2 style={styles.sectionTitle}>Upcoming Sessions</h2>
            {upcoming.length === 0 ? (
              <div className="card" style={styles.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                <p>You don't have any upcoming sessions.</p>
                <Link to="/tutors" className="btn btn-primary" style={{ marginTop: 16 }}>Find a tutor</Link>
              </div>
            ) : (
              <div style={styles.sessionsList}>
                {upcoming.map(s => <SessionCard key={s.id} session={s} />)}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>Past Sessions</h2>
                <div style={styles.sessionsList}>
                  {past.map(s => <SessionCard key={s.id} session={s} isPast />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session, isPast }) {
  const st = STATUS_STYLES[session.status] || STATUS_STYLES.pending;
  return (
    <div className="card" style={{ ...styles.sessionCard, opacity: isPast ? 0.75 : 1 }}>
      <div style={styles.sessionTop}>
        <div>
          <div style={styles.sessionSubject}>{session.subject}</div>
          <div style={styles.sessionMeta}>with {session.tutorName}</div>
        </div>
        <span className={`badge ${st.badge}`}>{st.label}</span>
      </div>
      <div style={styles.sessionDetails}>
        <span>📅 {session.date}</span>
        <span>⏰ {session.time}</span>
      </div>
      {session.zoomLink && (
        <a
          href={session.zoomLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ marginTop: 12, fontSize: 14 }}
        >
          📹 Join Zoom Meeting
        </a>
      )}
      {!session.zoomLink && session.status === "pending" && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10 }}>
          Waiting for tutor to confirm. Zoom link will appear here.
        </p>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "40px 0", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 },
  title: { fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 4 },
  subtitle: { color: "var(--text-muted)", fontSize: 15 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 },
  stat: { textAlign: "center" },
  statNum: { fontFamily: "var(--font-display)", fontSize: 36, color: "var(--green)" },
  statLabel: { fontSize: 13, color: "var(--text-muted)", marginTop: 4 },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 },
  sessionsList: { display: "flex", flexDirection: "column", gap: 16 },
  sessionCard: {},
  sessionTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  sessionSubject: { fontWeight: 600, fontSize: 17 },
  sessionMeta: { color: "var(--text-muted)", fontSize: 14, marginTop: 2 },
  sessionDetails: { display: "flex", gap: 20, fontSize: 14, color: "var(--text-muted)" },
  empty: { textAlign: "center", padding: "40px" },
};
